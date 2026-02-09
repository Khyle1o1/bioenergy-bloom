import { useEffect, useState } from 'react';
import { preTestQuestions } from '@/data/quizQuestions';
import { FileQuestion, AlertCircle, ArrowLeft, ChevronRight, Trophy } from 'lucide-react';

interface PreTestProps {
  onComplete: (score: number) => void;
  completed: boolean;
  score: number | null;
  // Called when the learner chooses to move into Lesson 1
  onStartLesson1?: () => void;
  // Notifies the parent layout when the pre-test enters or exits
  // immersive full-screen mode so headers / tabs can be hidden.
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

export function PreTest({
  onComplete,
  completed,
  score,
  onStartLesson1,
  onFullscreenChange,
}: PreTestProps) {
  const [phase, setPhase] = useState<'intro' | 'question' | 'results'>(
    completed && score !== null ? 'results' : 'intro'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    () => Array(preTestQuestions.length).fill(-1)
  );
  const [finalScore, setFinalScore] = useState<number | null>(score);

  const totalQuestions = preTestQuestions.length;
  const currentQuestion = preTestQuestions[currentIndex];
  const hasAnswerForCurrent = answers[currentIndex] !== -1;

  // Toggle full-screen mode styles and notify parent when in question/results phases
  useEffect(() => {
    const fullscreen = phase === 'question' || phase === 'results';

    if (typeof document !== 'undefined') {
      document.body.style.overflow = fullscreen ? 'hidden' : '';
    }

    onFullscreenChange?.(fullscreen);
  }, [phase, onFullscreenChange]);

  const handleStart = () => {
    setPhase('question');
    setCurrentIndex(0);
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIndex;
      return next;
    });
  };

  const handleNext = () => {
    if (!hasAnswerForCurrent) return;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    let correct = 0;
    preTestQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    setFinalScore(correct);
    onComplete(correct);
    setPhase('results');
  };

  const percentage =
    finalScore !== null ? Math.round((finalScore / totalQuestions) * 100) : 0;

  if (phase === 'intro') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
        <div className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-50 to-emerald-50 border border-emerald-100 shadow-lg p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileQuestion className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Pre-Test</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Get a quick snapshot of what you already know before starting the lessons.
            This won&apos;t affect your grade — it simply guides your learning path.
          </p>

          <div className="flex items-center justify-center gap-6 mb-8 text-sm">
            <div className="flex flex-col items-center">
              <span className="font-semibold">30 Questions</span>
              <span className="text-muted-foreground text-xs">
                Multiple-choice
              </span>
            </div>
            <div className="w-px h-10 bg-emerald-200" />
            <div className="flex flex-col items-center">
              <span className="font-semibold">~15 minutes</span>
              <span className="text-muted-foreground text-xs">
                Recommended time
              </span>
            </div>
          </div>

          {!completed && (
            <div className="mt-2 mb-6 p-4 rounded-xl bg-sunlight/10 border border-sunlight/20 flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-sunlight flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">
                  Complete once to unlock Lesson 1
                </p>
                <p className="text-sm text-muted-foreground">
                  Answer honestly — this helps you see your growth after the lessons.
                </p>
              </div>
            </div>
          )}

          {completed && finalScore !== null && (
            <div className="mt-2 mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-left">
              <p className="font-semibold text-primary">
                ✅ Pre-Test Completed: {finalScore}/{totalQuestions} ({percentage}%)
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You can review the questions again or jump straight into Lesson 1.
              </p>
            </div>
          )}

          <button
            onClick={handleStart}
            className="btn-nature px-8 py-3 text-base font-semibold inline-flex items-center justify-center gap-2"
          >
            Start Pre-Test
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'results' && finalScore !== null) {
    return (
      <div className="min-h-screen w-full flex items-start justify-center bg-[hsl(var(--background))] animate-fade-in px-4 py-10 sm:py-12">
        <div className="w-full max-w-3xl flex justify-center">
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-[0_18px_45px_rgba(15,60,30,0.18)] border border-emerald-100/80 px-6 py-7 sm:px-10 sm:py-9 text-center">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center border border-primary/15">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
              Pre-Test Complete
            </h2>
            <p className="text-4xl sm:text-5xl font-extrabold text-primary mb-1">
              {finalScore}/{totalQuestions}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              That&apos;s {percentage}% on your diagnostic assessment.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-8">
              Remember: this pre-test is just to see what you already know. You&apos;ll
              have the chance to strengthen any weak spots in the upcoming lessons.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhase('question');
                  setCurrentIndex(0);
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-primary/20 text-primary font-semibold flex items-center justify-center gap-2 hover:bg-primary/5 bg-white transition-colors"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={() => onStartLesson1?.()}
                className="flex-1 btn-nature px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                Start Lesson 1
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[hsl(var(--background))] animate-fade-in">
      {/* Top progress section */}
      <header className="w-full flex justify-center px-4 pt-6">
        <div className="w-full max-w-4xl flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-primary" />
              <span className="font-semibold tracking-wide">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-medium text-muted-foreground">
              Pre-Test • No time pressure
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden shadow-inner">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Middle: question + options */}
      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-3xl shadow-[0_18px_45px_rgba(15,60,30,0.18)] border border-emerald-100/80 px-6 py-6 sm:px-8 sm:py-7">
            <div className="mb-5">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-primary/80 font-semibold mb-1">
                Question {currentQuestion.id}
              </p>
              <h2 className="text-lg sm:text-2xl font-semibold leading-relaxed text-foreground">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentIndex] === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectOption(index)}
                    className={`w-full min-h-[3rem] sm:min-h-[3.25rem] flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 rounded-2xl border text-left text-sm sm:text-base transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-muted/40 hover:bg-white hover:border-primary/40'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full border text-xs font-bold flex-shrink-0 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-muted-foreground/30 text-muted-foreground bg-white'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-foreground leading-relaxed">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom navigation */}
            <div className="mt-7 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!hasAnswerForCurrent}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-xl text-sm sm:text-base font-semibold btn-nature disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentIndex === totalQuestions - 1
                  ? 'Finish Pre-Test'
                  : 'Next Question'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
