import { CategoryId } from '../types';
import { categories } from '../data/categories';
import Button from './ui/Button';
import Card from './ui/Card';

interface CategorySelectProps {
  onSelect: (categoryId: CategoryId) => void;
  onBack: () => void;
}

const categoryIcons: Record<CategoryId, string> = {
  agile: '🏃',
  corporate: '💼',
  tech: '💻',
  jessingo: '😎',
};

const categoryColors: Record<CategoryId, { bg: string; border: string; hover: string }> = {
  agile: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    hover: 'hover:border-green-400 hover:bg-green-100',
  },
  corporate: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    hover: 'hover:border-purple-400 hover:bg-purple-100',
  },
  tech: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    hover: 'hover:border-blue-400 hover:bg-blue-100',
  },
  jessingo: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hover: 'hover:border-amber-400 hover:bg-amber-100',
  },
};

export function CategorySelect({ onSelect, onBack }: CategorySelectProps) {
  const categoryIds: CategoryId[] = ['agile', 'corporate', 'tech', 'jessingo'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            MEETING BINGO
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Category</h2>
        <p className="text-gray-600 mb-8">Select the type of jargon you expect to hear</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {categoryIds.map((categoryId) => {
            const category = categories[categoryId];
            const colors = categoryColors[categoryId];
            const icon = categoryIcons[categoryId];
            const sampleWords = category.words.slice(0, 5);

            return (
              <Card
                key={categoryId}
                variant="bordered"
                padding="lg"
                onClick={() => onSelect(categoryId)}
                className={`cursor-pointer transition-all duration-200 ${colors.bg} ${colors.border} ${colors.hover} border-2`}
              >
                {/* Icon */}
                <div className="text-5xl mb-4 text-center">{icon}</div>

                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {category.description}
                </p>

                {/* Sample Words */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {sampleWords.map((word) => (
                    <span
                      key={word}
                      className="px-2 py-1 bg-white/70 rounded-full text-xs text-gray-700 border border-gray-200"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default CategorySelect;
