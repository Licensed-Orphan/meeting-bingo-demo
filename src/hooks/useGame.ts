import { useState, useCallback, useMemo } from 'react';
import { GameState, GameStatus, CategoryId, BingoCard, WinningLine } from '../types';
import { generateCard, getCardWords } from '../lib/cardGenerator';
import { checkForBingo, countFilled } from '../lib/bingoChecker';

/**
 * Initial game state
 */
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

/**
 * Return type for the useGame hook
 */
export interface UseGameReturn {
  // State
  game: GameState;
  cardWords: string[];
  filledWordsSet: Set<string>;

  // Actions
  startGame: (categoryId: CategoryId) => void;
  fillSquare: (row: number, col: number, word?: string) => boolean;
  toggleSquare: (row: number, col: number) => void;
  checkWin: () => WinningLine | null;
  resetGame: () => void;
  setListening: (listening: boolean) => void;
}

/**
 * Custom hook to manage game state
 * Provides all game logic including card generation, square filling, and win detection
 *
 * @returns Game state and control functions
 */
export function useGame(): UseGameReturn {
  const [game, setGame] = useState<GameState>(initialGameState);

  /**
   * Get all words on the current card for detection
   */
  const cardWords = useMemo(() => {
    if (!game.card) return [];
    return getCardWords(game.card);
  }, [game.card]);

  /**
   * Get set of already filled words for efficient lookup
   */
  const filledWordsSet = useMemo(() => {
    if (!game.card) return new Set<string>();
    const filled = new Set<string>();
    for (const row of game.card.squares) {
      for (const square of row) {
        if (square.isFilled && !square.isFreeSpace) {
          filled.add(square.word.toLowerCase());
        }
      }
    }
    return filled;
  }, [game.card]);

  /**
   * Start a new game with the specified category
   */
  const startGame = useCallback((categoryId: CategoryId) => {
    const card = generateCard(categoryId);

    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1, // Free space starts filled
    });
  }, []);

  /**
   * Fill a square at the specified position
   * Returns true if the square was filled, false if already filled or invalid
   */
  const fillSquare = useCallback((row: number, col: number, word?: string): boolean => {
    let didFill = false;
    let winLine: WinningLine | null = null;

    setGame((prev) => {
      if (!prev.card || prev.status !== 'playing') return prev;

      const square = prev.card.squares[row]?.[col];
      if (!square || square.isFilled || square.isFreeSpace) {
        return prev;
      }

      // Create new card with updated square
      const newSquares = prev.card.squares.map((rowSquares, r) =>
        rowSquares.map((sq, c) => {
          if (r === row && c === col) {
            return {
              ...sq,
              isFilled: true,
              isAutoFilled: !!word, // Auto-filled if word was provided
              filledAt: Date.now(),
            };
          }
          return sq;
        })
      );

      const newCard: BingoCard = {
        ...prev.card,
        squares: newSquares,
      };

      didFill = true;

      // Check for bingo
      winLine = checkForBingo(newCard);

      if (winLine) {
        return {
          ...prev,
          card: newCard,
          status: 'won' as GameStatus,
          completedAt: Date.now(),
          winningLine: winLine,
          winningWord: word || square.word,
          filledCount: countFilled(newCard),
          isListening: false,
        };
      }

      return {
        ...prev,
        card: newCard,
        filledCount: countFilled(newCard),
      };
    });

    return didFill;
  }, []);

  /**
   * Toggle a square's filled state (for manual clicking)
   */
  const toggleSquare = useCallback((row: number, col: number) => {
    setGame((prev) => {
      if (!prev.card || prev.status !== 'playing') return prev;

      const square = prev.card.squares[row]?.[col];
      if (!square || square.isFreeSpace) {
        return prev;
      }

      // Create new card with toggled square
      const newSquares = prev.card.squares.map((rowSquares, r) =>
        rowSquares.map((sq, c) => {
          if (r === row && c === col) {
            return {
              ...sq,
              isFilled: !sq.isFilled,
              isAutoFilled: false, // Manual toggle clears auto-fill flag
              filledAt: !sq.isFilled ? Date.now() : null,
            };
          }
          return sq;
        })
      );

      const newCard: BingoCard = {
        ...prev.card,
        squares: newSquares,
      };

      // Check for bingo after toggle
      const winLine = checkForBingo(newCard);

      if (winLine) {
        return {
          ...prev,
          card: newCard,
          status: 'won' as GameStatus,
          completedAt: Date.now(),
          winningLine: winLine,
          winningWord: square.word,
          filledCount: countFilled(newCard),
          isListening: false,
        };
      }

      return {
        ...prev,
        card: newCard,
        filledCount: countFilled(newCard),
      };
    });
  }, []);

  /**
   * Check if the current card has a bingo
   * Returns the winning line if found, null otherwise
   */
  const checkWin = useCallback((): WinningLine | null => {
    if (!game.card) return null;
    return checkForBingo(game.card);
  }, [game.card]);

  /**
   * Reset the game to initial state
   */
  const resetGame = useCallback(() => {
    setGame(initialGameState);
  }, []);

  /**
   * Set the listening state (for speech recognition)
   */
  const setListening = useCallback((listening: boolean) => {
    setGame((prev) => ({
      ...prev,
      isListening: listening,
    }));
  }, []);

  return {
    game,
    cardWords,
    filledWordsSet,
    startGame,
    fillSquare,
    toggleSquare,
    checkWin,
    resetGame,
    setListening,
  };
}

export default useGame;
