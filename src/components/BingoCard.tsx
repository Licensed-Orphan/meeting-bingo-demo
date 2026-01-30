import { BingoCard as BingoCardType } from '../types';
import BingoSquare from './BingoSquare';

interface BingoCardProps {
  card: BingoCardType;
  winningSquares: string[];
  potentialWinningSquares?: string[];
  onSquareClick: (row: number, col: number) => void;
}

export function BingoCard({ card, winningSquares, potentialWinningSquares = [], onSquareClick }: BingoCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {['B', 'I', 'N', 'G', 'O'].map((letter) => (
          <div
            key={letter}
            className="text-center font-bold text-2xl text-blue-600"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Bingo Grid */}
      <div className="grid grid-cols-5 gap-1.5 p-2 bg-gray-100 rounded-xl shadow-inner">
        {card.squares.map((row, rowIndex) =>
          row.map((square, colIndex) => (
            <BingoSquare
              key={square.id}
              square={square}
              isWinningSquare={winningSquares.includes(square.id)}
              isPotentialWinner={potentialWinningSquares.includes(square.id)}
              onClick={() => onSquareClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BingoCard;
