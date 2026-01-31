import { useState, useCallback } from 'react';
import { GameState, CategoryId, BingoSquare } from './types';
import { getRandomWords } from './data/categories';
import LandingPage from './components/LandingPage';
import CategorySelect from './components/CategorySelect';
import GameBoard from './components/GameBoard';
import WinScreen from './components/WinScreen';

type Screen = 'landing' | 'category' | 'game' | 'win';

// Generate a new bingo card
function generateBingoCard(categoryId: CategoryId): { squares: BingoSquare[][]; words: string[] } {
  const words = getRandomWords(categoryId, 24);
  const squares: BingoSquare[][] = [];
  let wordIndex = 0;

  for (let row = 0; row < 5; row++) {
    const rowSquares: BingoSquare[] = [];
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

// Initial game state
const initialGameState: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [game, setGame] = useState<GameState>(initialGameState);

  // Handle start button click
  const handleStart = useCallback(() => {
    setScreen('category');
  }, []);

  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: CategoryId) => {
    const card = generateBingoCard(categoryId);
    setGame({
      ...initialGameState,
      status: 'playing',
      category: categoryId,
      card,
      filledCount: 1, // Free space is already filled
      startedAt: Date.now(), // Start timer when game begins
    });
    setScreen('game');
  }, []);

  // Handle going back to landing
  const handleBackToLanding = useCallback(() => {
    setGame(initialGameState);
    setScreen('landing');
  }, []);

  // Handle win
  const handleWin = useCallback(() => {
    setScreen('win');
  }, []);

  // Handle play again (same category)
  const handlePlayAgain = useCallback(() => {
    if (game.category) {
      const card = generateBingoCard(game.category);
      setGame({
        ...initialGameState,
        status: 'playing',
        category: game.category,
        card,
        filledCount: 1,
        startedAt: Date.now(), // Start timer when game begins
      });
      setScreen('game');
    } else {
      setScreen('category');
    }
  }, [game.category]);

  // Render appropriate screen
  switch (screen) {
    case 'landing':
      return <LandingPage onStart={handleStart} />;

    case 'category':
      return (
        <CategorySelect
          onSelect={handleCategorySelect}
          onBack={handleBackToLanding}
        />
      );

    case 'game':
      return (
        <GameBoard
          game={game}
          setGame={setGame}
          onWin={handleWin}
        />
      );

    case 'win':
      return (
        <WinScreen
          game={game}
          onPlayAgain={handlePlayAgain}
          onHome={handleBackToLanding}
        />
      );

    default:
      return <LandingPage onStart={handleStart} />;
  }
}

export default App;
