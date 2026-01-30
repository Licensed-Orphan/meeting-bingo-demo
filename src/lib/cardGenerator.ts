import { BingoCard, BingoSquare, CategoryId } from '../types';
import { getCategoryById } from '../data/categories';

/**
 * Fisher-Yates shuffle algorithm
 * Produces an unbiased permutation of the input array
 * @param array - The array to shuffle
 * @returns A new shuffled array (original is not modified)
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a unique bingo card for a category
 * Creates a 5x5 grid with 24 random words and a center free space
 * @param categoryId - The category to generate a card for
 * @returns A BingoCard with shuffled words
 * @throws Error if category is not found
 */
export function generateCard(categoryId: CategoryId): BingoCard {
  const category = getCategoryById(categoryId);
  if (!category) {
    throw new Error(`Unknown category: ${categoryId}`);
  }

  // Shuffle and pick 24 words (25th position is free space)
  const shuffledWords = shuffle(category.words);
  const selectedWords = shuffledWords.slice(0, 24);

  // Build 5x5 grid
  const squares: BingoSquare[][] = [];
  let wordIndex = 0;

  for (let row = 0; row < 5; row++) {
    const rowSquares: BingoSquare[] = [];

    for (let col = 0; col < 5; col++) {
      const isFreeSpace = row === 2 && col === 2;

      const square: BingoSquare = {
        id: `${row}-${col}`,
        word: isFreeSpace ? 'FREE' : selectedWords[wordIndex++],
        isFilled: isFreeSpace, // Free space starts filled
        isAutoFilled: false,
        isFreeSpace,
        filledAt: isFreeSpace ? Date.now() : null,
        row,
        col,
      };

      rowSquares.push(square);
    }

    squares.push(rowSquares);
  }

  return {
    squares,
    words: selectedWords, // For efficient word detection
  };
}

/**
 * Get all words on card (excluding free space)
 * @param card - The bingo card
 * @returns Array of words on the card
 */
export function getCardWords(card: BingoCard): string[] {
  return card.words;
}
