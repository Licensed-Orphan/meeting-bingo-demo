import Button from './ui/Button';
import Card from './ui/Card';

interface LandingPageProps {
  onStart: () => void;
}

const steps = [
  {
    number: '1',
    title: 'Pick a Category',
    description: 'Choose from Agile, Corporate Speak, or Tech jargon',
  },
  {
    number: '2',
    title: 'Start Listening',
    description: 'Enable microphone access for speech detection',
  },
  {
    number: '3',
    title: 'Play Along',
    description: 'Words auto-fill as they\'re spoken in your meeting',
  },
  {
    number: '4',
    title: 'Get Bingo!',
    description: 'Complete a row, column, or diagonal to win',
  },
];

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo/Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>
              M
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '50ms' }}>
              E
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '100ms' }}>
              E
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>
              T
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '200ms' }}>
              I
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '250ms' }}>
              N
            </span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>
              G
            </span>
            <span className="inline-block mx-2">B</span>
            <span className="inline-block">I</span>
            <span className="inline-block">N</span>
            <span className="inline-block">G</span>
            <span className="inline-block">O</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Turn any meeting into a game
          </p>

          {/* CTA Button */}
          <Button
            onClick={onStart}
            size="lg"
            className="text-xl px-8 py-4 mb-6"
          >
            NEW GAME
          </Button>

          {/* Privacy Message */}
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span>Audio processed locally. Never recorded.</span>
          </p>
        </div>
      </main>

      {/* How It Works Section */}
      <section className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <Card
                key={step.number}
                variant="bordered"
                padding="lg"
                className="text-center hover:border-blue-300 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>Made for meetings everywhere</p>
      </footer>
    </div>
  );
}

export default LandingPage;
