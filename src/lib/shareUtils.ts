import { GameState } from '../types';
import { getCategoryById } from '../data/categories';

/**
 * Format time duration in a human-readable format
 * @param ms - Duration in milliseconds
 * @returns Formatted time string
 */
function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Generate shareable result text for a completed game
 * @param game - The completed game state
 * @returns Formatted text string for sharing
 */
export function generateShareText(game: GameState): string {
  const categoryName = game.category
    ? getCategoryById(game.category)?.name || 'Meeting'
    : 'Meeting';

  const duration = game.startedAt && game.completedAt
    ? game.completedAt - game.startedAt
    : 0;

  const lines = [
    'BINGO! Meeting Bingo',
    '',
    `Time to Bingo: ${formatDuration(duration)}`,
    game.winningWord ? `Winning word: "${game.winningWord}"` : '',
    `Squares filled: ${game.filledCount}/25`,
    `Category: ${categoryName}`,
    '',
    'Play Meeting Bingo -> meetingbingo.app',
  ];

  return lines.filter((line) => line !== '').join('\n');
}

/**
 * Copy text to clipboard
 * @param text - The text to copy
 * @returns Promise resolving to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Check if the Web Share API is available
 * @returns true if native sharing is supported
 */
export function canShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

/**
 * Share game result using native share API or fallback to clipboard
 * @param game - The completed game state
 * @throws Error if sharing fails completely
 */
export async function shareResult(game: GameState): Promise<void> {
  const text = generateShareText(game);

  if (canShare()) {
    try {
      await navigator.share({
        title: 'Meeting Bingo',
        text,
      });
      return;
    } catch (error) {
      // User cancelled or share failed, fall back to clipboard
      if ((error as Error).name === 'AbortError') {
        // User cancelled sharing, not an error
        return;
      }
    }
  }

  // Fallback to clipboard
  const success = await copyToClipboard(text);
  if (!success) {
    throw new Error('Failed to share or copy to clipboard');
  }
}
