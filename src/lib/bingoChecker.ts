import { BingoCard, BingoSquare, WinningLine } from '../types';

/**
 * Check all possible winning lines on a bingo card
 * Returns the first winning line found, or null if no bingo
 * @param card - The bingo card to check
 * @returns WinningLine if bingo found, null otherwise
 */
export function checkForBingo(card: BingoCard): WinningLine | null {
  const { squares } = card;

  // Check rows (5 possible)
  for (let row = 0; row < 5; row++) {
    if (squares[row].every((sq) => sq.isFilled)) {
      return {
        type: 'row',
        index: row,
        squares: squares[row],
      };
    }
  }

  // Check columns (5 possible)
  for (let col = 0; col < 5; col++) {
    const columnFilled = squares.every((row) => row[col].isFilled);
    if (columnFilled) {
      return {
        type: 'column',
        index: col,
        squares: squares.map((row) => row[col]),
      };
    }
  }

  // Check diagonal (top-left to bottom-right)
  const diagonal1Squares = [0, 1, 2, 3, 4].map((i) => squares[i][i]);
  const diagonal1Filled = diagonal1Squares.every((sq) => sq.isFilled);
  if (diagonal1Filled) {
    return {
      type: 'diagonal',
      index: 0,
      squares: diagonal1Squares,
    };
  }

  // Check diagonal (top-right to bottom-left)
  const diagonal2Squares = [0, 1, 2, 3, 4].map((i) => squares[i][4 - i]);
  const diagonal2Filled = diagonal2Squares.every((sq) => sq.isFilled);
  if (diagonal2Filled) {
    return {
      type: 'diagonal',
      index: 1,
      squares: diagonal2Squares,
    };
  }

  return null;
}

/**
 * Count the number of filled squares on the card
 * @param card - The bingo card
 * @returns Number of filled squares
 */
export function countFilled(card: BingoCard): number {
  return card.squares.flat().filter((sq) => sq.isFilled).length;
}

/**
 * Information about a line close to winning
 */
export interface NearWinInfo {
  needed: number;
  line: string;
  neededWords: string[];
  neededSquareIds: string[];
}

/**
 * Get information about the line closest to winning
 * Useful for UI hints to show progress
 * @param card - The bingo card
 * @returns Object with needed count, line name, and needed words, or null if no progress
 */
export function getClosestToWin(card: BingoCard): NearWinInfo | null {
  const { squares } = card;
  let closest: NearWinInfo = { needed: 5, line: '', neededWords: [], neededSquareIds: [] };

  interface LineInfo {
    squares: BingoSquare[];
    name: string;
  }

  // Build all possible lines
  const lines: LineInfo[] = [
    // Rows
    ...squares.map((row, i) => ({
      squares: row,
      name: `Row ${i + 1}`,
    })),
    // Columns
    ...[0, 1, 2, 3, 4].map((col) => ({
      squares: squares.map((row) => row[col]),
      name: `Column ${col + 1}`,
    })),
    // Diagonals
    {
      squares: [0, 1, 2, 3, 4].map((i) => squares[i][i]),
      name: 'Diagonal',
    },
    {
      squares: [0, 1, 2, 3, 4].map((i) => squares[i][4 - i]),
      name: 'Diagonal',
    },
  ];

  for (const line of lines) {
    const filled = line.squares.filter((sq) => sq.isFilled).length;
    const needed = 5 - filled;
    if (needed < closest.needed && needed > 0) {
      const unfilledSquares = line.squares.filter((sq) => !sq.isFilled);
      closest = {
        needed,
        line: line.name,
        neededWords: unfilledSquares.map((sq) => sq.word),
        neededSquareIds: unfilledSquares.map((sq) => sq.id),
      };
    }
  }

  return closest.needed < 5 ? closest : null;
}

/**
 * Get all lines that are one square away from winning
 * @param card - The bingo card
 * @returns Array of near-win info for all lines needing 1 square
 */
export function getAllNearWins(card: BingoCard): NearWinInfo[] {
  const { squares } = card;
  const nearWins: NearWinInfo[] = [];

  interface LineInfo {
    squares: BingoSquare[];
    name: string;
  }

  const lines: LineInfo[] = [
    ...squares.map((row, i) => ({ squares: row, name: `Row ${i + 1}` })),
    ...[0, 1, 2, 3, 4].map((col) => ({
      squares: squares.map((row) => row[col]),
      name: `Column ${col + 1}`,
    })),
    { squares: [0, 1, 2, 3, 4].map((i) => squares[i][i]), name: 'Diagonal' },
    { squares: [0, 1, 2, 3, 4].map((i) => squares[i][4 - i]), name: 'Diagonal' },
  ];

  for (const line of lines) {
    const filled = line.squares.filter((sq) => sq.isFilled).length;
    if (filled === 4) {
      const unfilledSquares = line.squares.filter((sq) => !sq.isFilled);
      nearWins.push({
        needed: 1,
        line: line.name,
        neededWords: unfilledSquares.map((sq) => sq.word),
        neededSquareIds: unfilledSquares.map((sq) => sq.id),
      });
    }
  }

  return nearWins;
}
