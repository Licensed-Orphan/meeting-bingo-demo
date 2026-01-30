import { cn } from '../lib/utils';

interface TranscriptPanelProps {
  transcript: string;
  interimTranscript: string;
  detectedWords: string[];
  isListening: boolean;
}

export function TranscriptPanel({
  transcript,
  interimTranscript,
  detectedWords,
  isListening,
}: TranscriptPanelProps) {
  // Show last 100 characters of transcript
  const displayTranscript = transcript.slice(-100);
  const hasTranscript = transcript.length > 0 || interimTranscript.length > 0;

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      {/* Listening Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className={cn(
            'w-3 h-3 rounded-full transition-colors duration-300',
            isListening
              ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
              : 'bg-gray-300'
          )}
        />
        <span className={cn('text-sm font-medium', isListening ? 'text-red-600' : 'text-gray-500')}>
          {isListening ? 'Listening...' : 'Paused'}
        </span>
      </div>

      {/* Transcript Display */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 min-h-[60px]">
        {hasTranscript ? (
          <p className="text-sm text-gray-700">
            {displayTranscript && (
              <span>
                {transcript.length > 100 && '...'}
                {displayTranscript}
              </span>
            )}
            {interimTranscript && (
              <span className="text-gray-400 italic"> {interimTranscript}</span>
            )}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            {isListening
              ? 'Waiting for speech...'
              : 'Press "Start Listening" to begin'}
          </p>
        )}
      </div>

      {/* Detected Words */}
      {detectedWords.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Detected words:</p>
          <div className="flex flex-wrap gap-2">
            {detectedWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TranscriptPanel;
