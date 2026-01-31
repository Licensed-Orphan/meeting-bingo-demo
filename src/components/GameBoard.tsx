import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GameState, BingoSquare as BingoSquareType, WinningLine, IWebSpeechRecognition } from '../types';
import { categories, getRandomWords } from '../data/categories';
import BingoCard from './BingoCard';
import TranscriptPanel from './TranscriptPanel';
import GameControls from './GameControls';
import { ToastContainer, useToast } from './ui/Toast';
import { cn } from '../lib/utils';
import { getClosestToWin, getAllNearWins, NearWinInfo } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';

interface GameBoardProps {
  game: GameState;
  setGame: React.Dispatch<React.SetStateAction<GameState>>;
  onWin: () => void;
}

// Generate a new bingo card
function generateBingoCard(categoryId: string): { squares: BingoSquareType[][]; words: string[] } {
  const words = getRandomWords(categoryId as 'agile' | 'corporate' | 'tech', 24);
  const squares: BingoSquareType[][] = [];
  let wordIndex = 0;

  for (let row = 0; row < 5; row++) {
    const rowSquares: BingoSquareType[] = [];
    for (let col = 0; col < 5; col++) {
      const isFreeSpace = row === 2 && col === 2;
      rowSquares.push({
        id: `${row}-${col}`,
        word: isFreeSpace ? 'FREE' : words[wordIndex],
        isFilled: isFreeSpace,
        isAutoFilled: false,
        isFreeSpace,
        filledAt: isFreeSpace ? Date.now() : null,
        row,
        col,
      });
      if (!isFreeSpace) wordIndex++;
    }
    squares.push(rowSquares);
  }

  return { squares, words };
}

// Check for a winning line
function checkForWin(squares: BingoSquareType[][]): WinningLine | null {
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (squares[row].every((sq) => sq.isFilled)) {
      return { type: 'row', index: row, squares: squares[row] };
    }
  }

  // Check columns
  for (let col = 0; col < 5; col++) {
    const column = squares.map((row) => row[col]);
    if (column.every((sq) => sq.isFilled)) {
      return { type: 'column', index: col, squares: column };
    }
  }

  // Check diagonals
  const diagonal1 = [0, 1, 2, 3, 4].map((i) => squares[i][i]);
  if (diagonal1.every((sq) => sq.isFilled)) {
    return { type: 'diagonal', index: 0, squares: diagonal1 };
  }

  const diagonal2 = [0, 1, 2, 3, 4].map((i) => squares[i][4 - i]);
  if (diagonal2.every((sq) => sq.isFilled)) {
    return { type: 'diagonal', index: 1, squares: diagonal2 };
  }

  return null;
}

export function GameBoard({ game, setGame, onWin }: GameBoardProps) {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [detectedWords, setDetectedWords] = useState<string[]>([]);
  const recognitionRef = useRef<IWebSpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const { toasts, addToast, removeToast } = useToast();

  // Calculate near-win info
  const nearWinInfo = useMemo((): NearWinInfo | null => {
    if (!game.card || game.status !== 'playing') return null;
    return getClosestToWin(game.card);
  }, [game.card, game.status]);

  // Get all squares that would complete a bingo
  const potentialWinningSquareIds = useMemo((): string[] => {
    if (!game.card || game.status !== 'playing') return [];
    const nearWins = getAllNearWins(game.card);
    const ids = new Set<string>();
    nearWins.forEach((nw) => nw.neededSquareIds.forEach((id) => ids.add(id)));
    return Array.from(ids);
  }, [game.card, game.status]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + ' ' + final);
        // Check for word matches
        checkForMatches(final);
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setGame((prev) => ({ ...prev, isListening: false }));
        isListeningRef.current = false;
      }
    };

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Check transcript for matching words using alias-aware detection
  const checkForMatches = useCallback(
    (text: string) => {
      if (!game.card || game.status !== 'playing') return;

      // Get all unfilled card words
      const cardWords: string[] = [];
      const filledWords = new Set<string>();

      game.card.squares.forEach((row) => {
        row.forEach((square) => {
          if (!square.isFreeSpace) {
            cardWords.push(square.word);
            if (square.isFilled) {
              filledWords.add(square.word.toLowerCase());
            }
          }
        });
      });

      // Use alias-aware detection from wordDetector
      const detectedMatches = detectWordsWithAliases(text, cardWords, filledWords);

      if (detectedMatches.length === 0) return;

      setGame((prev) => {
        if (!prev.card) return prev;

        let lastMatchedWord: string | null = null;
        const matchedWordsLower = new Set(detectedMatches.map(w => w.toLowerCase()));

        const newSquares = prev.card.squares.map((row) =>
          row.map((square) => {
            if (square.isFilled || square.isFreeSpace) return square;

            if (matchedWordsLower.has(square.word.toLowerCase())) {
              lastMatchedWord = square.word;
              return {
                ...square,
                isFilled: true,
                isAutoFilled: true,
                filledAt: Date.now(),
              };
            }
            return square;
          })
        );

        // Update detected words list and show toasts for each match
        detectedMatches.forEach((word) => {
          setDetectedWords((words) => [...words.slice(-9), word]);
          addToast(`Detected: ${word}`, 'success', 2000);
        });

        const filledCount = newSquares.flat().filter((sq) => sq.isFilled).length;
        const winningLine = checkForWin(newSquares);

        if (winningLine) {
          setTimeout(() => onWin(), 500);
          return {
            ...prev,
            card: { ...prev.card, squares: newSquares },
            filledCount,
            winningLine,
            winningWord: lastMatchedWord,
            completedAt: Date.now(),
            status: 'won',
          };
        }

        return {
          ...prev,
          card: { ...prev.card, squares: newSquares },
          filledCount,
        };
      });
    },
    [game.card, game.status, setGame, onWin, addToast]
  );

  // Toggle listening
  const handleToggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (game.isListening) {
      recognitionRef.current.stop();
      isListeningRef.current = false;
      setGame((prev) => ({ ...prev, isListening: false }));
    } else {
      try {
        recognitionRef.current.start();
        isListeningRef.current = true;
        setGame((prev) => ({
          ...prev,
          isListening: true,
          startedAt: prev.startedAt || Date.now(),
        }));
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }, [game.isListening, setGame]);

  // Generate new card
  const handleNewCard = useCallback(() => {
    if (!game.category) return;
    const newCard = generateBingoCard(game.category);
    setTranscript('');
    setInterimTranscript('');
    setDetectedWords([]);
    setGame((prev) => ({
      ...prev,
      card: newCard,
      filledCount: 1, // Free space
      winningLine: null,
      winningWord: null,
      startedAt: prev.isListening ? Date.now() : null,
      completedAt: null,
    }));
  }, [game.category, setGame]);

  // Handle manual square click
  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (game.status !== 'playing' || !game.card) return;

      const square = game.card.squares[row][col];
      if (square.isFreeSpace) return;

      setGame((prev) => {
        if (!prev.card) return prev;

        const newSquares = prev.card.squares.map((r, ri) =>
          r.map((sq, ci) => {
            if (ri === row && ci === col) {
              return {
                ...sq,
                isFilled: !sq.isFilled,
                isAutoFilled: false,
                filledAt: !sq.isFilled ? Date.now() : null,
              };
            }
            return sq;
          })
        );

        const filledCount = newSquares.flat().filter((sq) => sq.isFilled).length;
        const winningLine = checkForWin(newSquares);

        if (winningLine) {
          setTimeout(() => onWin(), 500);
          return {
            ...prev,
            card: { ...prev.card, squares: newSquares },
            filledCount,
            winningLine,
            winningWord: prev.card.squares[row][col].word,
            completedAt: Date.now(),
            status: 'won',
          };
        }

        return {
          ...prev,
          card: { ...prev.card, squares: newSquares },
          filledCount,
        };
      });
    },
    [game.status, game.card, setGame, onWin]
  );

  // Get winning square IDs
  const winningSquareIds = game.winningLine?.squares.map((sq) => sq.id) || [];

  // Get category info
  const category = game.category ? categories[game.category] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="py-4 px-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              MEETING BINGO
            </h1>
            {category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {category.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Near Bingo Indicator */}
            {nearWinInfo && nearWinInfo.needed === 1 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full animate-pulse">
                CLOSE!
              </div>
            )}

            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  game.isListening
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-gray-300'
                )}
              />
              <span className="text-sm text-gray-600">
                {game.isListening ? 'Active' : 'Paused'}
              </span>
            </div>

            {/* Progress Counter */}
            <div className="text-sm font-medium text-gray-700">
              {game.filledCount - 1}/24
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300 ease-out rounded-full',
                  nearWinInfo && nearWinInfo.needed === 1
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                    : 'bg-gradient-to-r from-blue-400 to-blue-500'
                )}
                style={{ width: `${((game.filledCount - 1) / 24) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
              {game.filledCount - 1}/24 squares
            </span>
          </div>
        </div>
      </div>

      {/* Near-Bingo Tension Indicator */}
      {nearWinInfo && nearWinInfo.needed === 1 && (
        <div className="px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-orange-700 font-medium text-center">
              One away! Need: <span className="font-bold">{nearWinInfo.neededWords[0]}</span>
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          {game.card && (
            <>
              <BingoCard
                card={game.card}
                winningSquares={winningSquareIds}
                potentialWinningSquares={potentialWinningSquareIds}
                onSquareClick={handleSquareClick}
              />

              <TranscriptPanel
                transcript={transcript}
                interimTranscript={interimTranscript}
                detectedWords={detectedWords}
                isListening={game.isListening}
              />

              <GameControls
                isListening={game.isListening}
                onToggleListening={handleToggleListening}
                onNewCard={handleNewCard}
                hideNewCard={category ? category.words.length <= 24 : false}
              />
            </>
          )}
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default GameBoard;
