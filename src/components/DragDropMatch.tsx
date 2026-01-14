import { useState, useEffect } from 'react';
import { CheckCircle, RotateCcw, Sparkles } from 'lucide-react';

interface MatchItem {
  id: string;
  term: string;
  definition: string;
}

interface DragDropMatchProps {
  title: string;
  items: MatchItem[];
  onComplete?: () => void;
}

export function DragDropMatch({ title, items, onComplete }: DragDropMatchProps) {
  const [terms, setTerms] = useState<MatchItem[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Shuffle terms
    setTerms([...items].sort(() => Math.random() - 0.5));
  }, [items]);

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDrop = (definitionId: string) => {
    if (!draggedItem) return;
    
    // Check if this slot already has an item
    const existingMatch = Object.entries(matches).find(([_, def]) => def === definitionId);
    if (existingMatch) {
      // Remove existing match
      const newMatches = { ...matches };
      delete newMatches[existingMatch[0]];
      setMatches(newMatches);
    }
    
    setMatches((prev) => ({ ...prev, [draggedItem]: definitionId }));
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const checkAnswers = () => {
    const allCorrect = items.every((item) => matches[item.id] === item.id);
    if (allCorrect) {
      setCompleted(true);
      onComplete?.();
    }
  };

  const isCorrect = (termId: string) => {
    return matches[termId] === termId;
  };

  const reset = () => {
    setMatches({});
    setCompleted(false);
    setTerms([...items].sort(() => Math.random() - 0.5));
  };

  const matchedTerms = Object.keys(matches);
  const availableTerms = terms.filter((t) => !matchedTerms.includes(t.id));

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-sunlight" />
        {title}
      </h3>

      {completed && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center bounce-success">
          <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-bold text-primary">🎉 Perfect Match!</p>
        </div>
      )}

      {/* Draggable Terms */}
      <div className="p-4 rounded-xl bg-muted/50 min-h-[80px]">
        <p className="text-xs text-muted-foreground mb-2">Drag items to match:</p>
        <div className="flex flex-wrap gap-2">
          {availableTerms.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              className="drag-item text-sm"
            >
              {item.term}
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zones */}
      <div className="space-y-3">
        {items.map((item) => {
          const matchedTermId = Object.entries(matches).find(([_, def]) => def === item.id)?.[0];
          const matchedTerm = terms.find((t) => t.id === matchedTermId);
          const correct = matchedTermId ? isCorrect(matchedTermId) : null;

          return (
            <div
              key={item.id}
              onDrop={() => handleDrop(item.id)}
              onDragOver={handleDragOver}
              className={`drop-zone flex items-center gap-3 ${
                matchedTerm 
                  ? correct 
                    ? 'success' 
                    : 'border-amber-400 bg-amber-50' 
                  : ''
              }`}
            >
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{item.definition}</p>
              </div>
              <div className="w-32 min-h-[40px] flex items-center justify-center">
                {matchedTerm ? (
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    correct 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {matchedTerm.term}
                    {correct && <CheckCircle className="w-4 h-4 inline ml-1" />}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Drop here</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 px-4 py-2 rounded-lg border-2 border-primary/20 font-semibold text-sm">
          <RotateCcw className="w-4 h-4 inline mr-1" /> Reset
        </button>
        <button 
          onClick={checkAnswers} 
          disabled={matchedTerms.length !== items.length}
          className="flex-1 btn-nature text-sm py-2 disabled:opacity-50"
        >
          Check Answers
        </button>
      </div>
    </div>
  );
}
