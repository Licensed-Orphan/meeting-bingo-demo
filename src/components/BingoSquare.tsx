import { BingoSquare as BingoSquareType } from '../types';
import { cn } from '../lib/utils';

interface BingoSquareProps {
  square: BingoSquareType;
  isWinningSquare: boolean;
  isPotentialWinner?: boolean;
  onClick: () => void;
}

export function BingoSquare({ square, isWinningSquare, isPotentialWinner = false, onClick }: BingoSquareProps) {
  const getSquareStyles = () => {
    // Winning square takes precedence
    if (isWinningSquare) {
      return 'bg-green-500 text-white border-green-600 shadow-lg';
    }

    // Free space
    if (square.isFreeSpace) {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }

    // Auto-filled (from speech detection)
    if (square.isAutoFilled) {
      return 'bg-blue-500 text-white border-blue-600 shadow-md';
    }

    // Manually filled
    if (square.isFilled) {
      return 'bg-blue-400 text-white border-blue-500 shadow-md';
    }

    // Potential winner - unfilled square that would complete a bingo
    if (isPotentialWinner) {
      return 'bg-orange-50 text-orange-800 border-orange-300 ring-2 ring-orange-400 ring-offset-1';
    }

    // Default unfilled
    return 'bg-white text-gray-800 border-gray-200 hover:border-blue-300 hover:bg-blue-50';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative aspect-square w-full border-2 rounded-lg p-1',
        'flex items-center justify-center text-center',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        square.isAutoFilled && !isWinningSquare && 'animate-pulse',
        isPotentialWinner && !square.isFilled && 'animate-pulse',
        getSquareStyles()
      )}
      aria-label={`${square.word}${square.isFilled ? ' (filled)' : ''}`}
    >
      <span
        className={cn(
          'font-medium leading-tight break-words hyphens-auto',
          'text-[10px] sm:text-xs md:text-sm',
          square.isFreeSpace && 'font-bold'
        )}
      >
        {square.isFreeSpace ? 'FREE' : square.word}
      </span>

      {/* Fill indicator dot */}
      {square.isFilled && !square.isFreeSpace && (
        <span
          className={cn(
            'absolute top-1 right-1 w-2 h-2 rounded-full',
            isWinningSquare ? 'bg-white' : 'bg-white/70'
          )}
        />
      )}
    </button>
  );
}

export default BingoSquare;
