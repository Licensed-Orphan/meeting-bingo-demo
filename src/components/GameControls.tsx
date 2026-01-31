import Button from './ui/Button';
import { cn } from '../lib/utils';

interface GameControlsProps {
  isListening: boolean;
  onToggleListening: () => void;
  onNewCard: () => void;
  hideNewCard?: boolean;
}

export function GameControls({
  isListening,
  onToggleListening,
  onNewCard,
  hideNewCard = false,
}: GameControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto mt-6">
      {/* Toggle Listening Button */}
      <Button
        onClick={onToggleListening}
        variant={isListening ? 'secondary' : 'primary'}
        size="lg"
        className={cn(
          'flex-1 transition-all duration-200',
          isListening && 'border-red-300 text-red-600 hover:bg-red-50'
        )}
      >
        {isListening ? (
          <>
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
            Stop Listening
          </>
        ) : (
          <>
            <span className="mr-2">🎤</span>
            Start Listening
          </>
        )}
      </Button>

      {/* New Card Button - hidden for fixed-size categories */}
      {!hideNewCard && (
        <Button
          onClick={onNewCard}
          variant="ghost"
          size="lg"
          className="flex-1"
        >
          <span className="mr-2">🔄</span>
          New Card
        </Button>
      )}
    </div>
  );
}

export default GameControls;
