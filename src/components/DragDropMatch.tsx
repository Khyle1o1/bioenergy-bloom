import { useState, useEffect } from 'react';
import { CheckCircle, RotateCcw, Sparkles, GripVertical } from 'lucide-react';

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
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setTerms([...items].sort(() => Math.random() - 0.5));
  }, [items]);

  // Handle tap/click on a term
  const handleTermClick = (id: string) => {
    setSelectedTerm(selectedTerm === id ? null : id);
  };

  // Handle tap/click on a drop zone
  const handleDropZoneClick = (definitionId: string) => {
    if (!selectedTerm) return;
    
    // Remove any existing match in this slot
    const existingMatch = Object.entries(matches).find(([_, def]) => def === definitionId);
    if (existingMatch) {
      const newMatches = { ...matches };
      delete newMatches[existingMatch[0]];
      setMatches(newMatches);
    }
    
    setMatches((prev) => ({ ...prev, [selectedTerm]: definitionId }));
    setSelectedTerm(null);
  };

  // Also support drag for desktop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setSelectedTerm(id);
  };

  const handleDrop = (e: React.DragEvent, definitionId: string) => {
    e.preventDefault();
    const termId = e.dataTransfer.getData('text/plain');
    if (!termId) return;
    
    const existingMatch = Object.entries(matches).find(([_, def]) => def === definitionId);
    if (existingMatch) {
      const newMatches = { ...matches };
      delete newMatches[existingMatch[0]];
      setMatches(newMatches);
    }
    
    setMatches((prev) => ({ ...prev, [termId]: definitionId }));
    setSelectedTerm(null);
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
    setSelectedTerm(null);
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

      {!completed && (
        <p className="text-sm text-muted-foreground bg-primary/5 p-3 rounded-lg">
          📱 <strong>Tap</strong> a term below, then <strong>tap</strong> the matching definition to connect them.
        </p>
      )}

      {completed && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center bounce-success">
          <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-bold text-primary">🎉 Perfect Match!</p>
        </div>
      )}

      {/* Clickable Terms */}
      <div className="p-4 rounded-xl bg-muted/50 min-h-[80px]">
        <p className="text-xs text-muted-foreground mb-2">Select a term:</p>
        <div className="flex flex-wrap gap-2">
          {availableTerms.map((item) => (
            <button
              key={item.id}
              type="button"
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onClick={() => handleTermClick(item.id)}
              className={`drag-item text-sm flex items-center gap-2 ${
                selectedTerm === item.id 
                  ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2' 
                  : ''
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              {item.term}
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zones - now clickable */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Then tap where it belongs:</p>
        {items.map((item) => {
          const matchedTermId = Object.entries(matches).find(([_, def]) => def === item.id)?.[0];
          const matchedTerm = terms.find((t) => t.id === matchedTermId);
          const correct = matchedTermId ? isCorrect(matchedTermId) : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleDropZoneClick(item.id)}
              onDrop={(e) => handleDrop(e, item.id)}
              onDragOver={handleDragOver}
              className={`drop-zone w-full flex items-center gap-3 text-left ${
                selectedTerm ? 'cursor-pointer hover:border-primary hover:bg-primary/5' : ''
              } ${
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
                  <span className="text-xs text-muted-foreground border-2 border-dashed border-muted-foreground/30 px-3 py-2 rounded-lg">
                    Drop here
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button 
          type="button"
          onClick={reset} 
          className="flex-1 px-4 py-2 rounded-lg border-2 border-primary/20 font-semibold text-sm hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4 inline mr-1" /> Reset
        </button>
        <button 
          type="button"
          onClick={checkAnswers} 
          disabled={matchedTerms.length !== items.length}
          className="flex-1 btn-nature text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Answers
        </button>
      </div>
    </div>
  );
}
