import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types';
import BingoCard from './BingoCard';
import Button from './ui/Button';
import Card from './ui/Card';
import { generateShareText, copyToClipboard, canShare } from '../lib/shareUtils';

interface WinScreenProps {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

export function WinScreen({ game, onPlayAgain, onHome }: WinScreenProps) {
  // Trigger confetti on mount
  useEffect(() => {
    // Discreet confetti celebration from the top
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 55,
        origin: { x: Math.random(), y: 0 },
        colors: ['#22c55e', '#3b82f6', '#eab308', '#8b5cf6', '#ec4899'],
        gravity: 1.2,
        scalar: 0.8,
        drift: 0,
        disableForReducedMotion: true,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Cleanup function
    return () => {
      confetti.reset();
    };
  }, []);

  // Calculate time to bingo
  const timeToBingo =
    game.startedAt && game.completedAt
      ? game.completedAt - game.startedAt
      : 0;

  // Get winning square IDs
  const winningSquareIds = game.winningLine?.squares.map((sq) => sq.id) || [];

  const handleShare = async () => {
    const shareText = generateShareText(game);

    if (canShare()) {
      try {
        await navigator.share({
          title: 'Meeting Bingo',
          text: shareText,
        });
        return;
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback: copy to clipboard
    const success = await copyToClipboard(shareText);
    if (success) {
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50 flex flex-col">
      {/* Celebration Header */}
      <header className="py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-green-600 mb-2 animate-bounce">
          BINGO!
        </h1>
        <p className="text-xl text-gray-600">Congratulations! You won!</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Winning Card Display */}
          {game.card && (
            <div className="mb-8">
              <BingoCard
                card={game.card}
                winningSquares={winningSquareIds}
                onSquareClick={() => {}}
              />
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <Card variant="bordered" padding="md" className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatTime(timeToBingo)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Time to Bingo</p>
            </Card>

            <Card variant="bordered" padding="md" className="text-center">
              <p className="text-lg font-bold text-green-600 truncate">
                {game.winningWord || '-'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Winning Word</p>
            </Card>

            <Card variant="bordered" padding="md" className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {game.filledCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">Squares Filled</p>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Button
              onClick={handleShare}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              <span className="mr-2">📤</span>
              Share Result
            </Button>

            <Button
              onClick={onPlayAgain}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              <span className="mr-2">🎮</span>
              Play Again
            </Button>
          </div>

          {/* Home Link */}
          <div className="text-center mt-6">
            <Button variant="ghost" onClick={onHome}>
              ← Back to Home
            </Button>
          </div>
        </div>
      </main>

    </div>
  );
}

export default WinScreen;
