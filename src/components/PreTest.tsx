import { preTestQuestions } from '@/data/quizQuestions';
import { QuizComponent } from './QuizComponent';
import { FileQuestion, AlertCircle } from 'lucide-react';

interface PreTestProps {
  onComplete: (score: number) => void;
  completed: boolean;
  score: number | null;
}

export function PreTest({ onComplete, completed, score }: PreTestProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FileQuestion className="w-7 h-7 text-primary" />
          Pre-Test
        </h1>
        <p className="text-muted-foreground">
          Test your knowledge before starting the lessons. Don't worry — this helps us understand where you're starting from!
        </p>
        
        {!completed && (
          <div className="mt-4 p-4 rounded-xl bg-sunlight/10 border border-sunlight/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-sunlight flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">30 Questions • ~15 minutes</p>
              <p className="text-sm text-muted-foreground">
                This is a diagnostic pre-test. Complete it once to unlock Lesson 1 — your score is just to see what you already know.
              </p>
            </div>
          </div>
        )}

        {completed && score !== null && (
          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <p className="font-semibold text-primary">
              ✅ Pre-Test Completed: {score}/30 ({Math.round(score / 30 * 100)}%)
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Lesson 1 is now unlocked. Use your score to see which topics you can review and improve.
            </p>
          </div>
        )}
      </div>

      <QuizComponent
        title="Pre-Test Questions"
        questions={preTestQuestions}
        onComplete={onComplete}
        passingScore={0}
        showResults={completed}
        allowRetry={false}
        diagnosticMode
      />
    </div>
  );
}
