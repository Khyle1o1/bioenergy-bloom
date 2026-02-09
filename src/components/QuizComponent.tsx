import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Trophy, Target } from 'lucide-react';
import { QuizQuestion } from '@/data/quizQuestions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAnswerLogger } from '@/hooks/useAnswerLogger';

interface QuizComponentProps {
  title: string;
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  passingScore?: number;
  showResults?: boolean;
  // When false, hides "Retry" actions so the quiz
  // can only be taken once (e.g. diagnostic pre-test).
  allowRetry?: boolean;
  // When true, treats the quiz as diagnostic-only:
  // no pass/fail gating or "need X% to unlock" messaging.
  diagnosticMode?: boolean;
  // Activity type for logging
  activityType?: 'lesson1_quiz' | 'lesson2_quiz' | 'lesson3_quiz' | 'posttest';
  // Lesson ID for logging
  lessonId?: string;
}

export function QuizComponent({ 
  title, 
  questions, 
  onComplete, 
  passingScore = 50,
  showResults = false,
  allowRetry = true,
  diagnosticMode = false,
  activityType = 'lesson1_quiz',
  lessonId,
}: QuizComponentProps) {
  const { logMultipleAnswers } = useAnswerLogger();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(showResults);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
    setShowModal(true);

    // Log all answers to database
    const answerLogs = questions.map((q) => {
      const selectedIndex = answers[q.id];
      return {
        activity_type: activityType,
        activity_name: `${title} - Question ${q.id}`,
        lesson_id: lessonId,
        question_id: `${activityType}_q${q.id}`,
        question_text: q.question,
        selected_answer: selectedIndex !== undefined ? q.options[selectedIndex] : 'Not answered',
        correct_answer: q.options[q.correctAnswer],
        is_correct: selectedIndex === q.correctAnswer,
      };
    });

    await logMultipleAnswers(answerLogs);
  };

  const handleContinue = () => {
    setShowModal(false);
    onComplete(score);
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setShowModal(false);
  };

  const percentage = Math.round((score / questions.length) * 100);
  const passed = diagnosticMode ? true : percentage >= passingScore;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          {title}
        </h2>
        <span className="text-sm text-muted-foreground">
          {Object.keys(answers).length}/{questions.length} answered
        </span>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {questions.map((q, index) => (
          <div key={q.id} className="quiz-card slide-up" style={{ animationDelay: `${index * 50}ms` }}>
            <p className="font-semibold mb-3">
              <span className="text-primary mr-2">{index + 1}.</span>
              {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((option, optIndex) => {
                const isSelected = answers[q.id] === optIndex;
                const isCorrect = q.correctAnswer === optIndex;
                let className = 'quiz-option';
                
                if (submitted) {
                  if (isCorrect) className += ' correct';
                  else if (isSelected && !isCorrect) className += ' incorrect';
                } else if (isSelected) {
                  className += ' selected';
                }

                return (
                  <button
                    key={optIndex}
                    onClick={() => handleSelect(q.id, optIndex)}
                    disabled={submitted}
                    className={className}
                  >
                    <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span className="text-sm text-left flex-1">{option}</span>
                    {submitted && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    {submitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="btn-nature w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answers <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {submitted && !showModal && allowRetry && (
        <div className="flex gap-3">
          <button onClick={handleRetry} className="flex-1 btn-nature bg-muted text-foreground">
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
          <button onClick={handleContinue} className="flex-1 btn-nature">
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Results Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm text-center" aria-describedby="quiz-results-desc">
          <DialogHeader>
            <DialogTitle className="sr-only">Quiz Results</DialogTitle>
            <DialogDescription id="quiz-results-desc" className="sr-only">
              Your quiz score and whether you passed
            </DialogDescription>
          </DialogHeader>
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bounce-success ${passed ? 'bg-primary/10' : 'bg-amber-100'}`}>
            <Trophy className={`w-10 h-10 ${passed ? 'text-primary' : 'text-amber-600'}`} />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {diagnosticMode ? 'Pre-Test Complete' : passed ? '🎉 Excellent!' : '💪 Keep Going!'}
          </h3>
          <p className="text-4xl font-bold text-primary mb-2">
            {score}/{questions.length}
          </p>
          <p className="text-muted-foreground mb-4">
            {percentage}% — {diagnosticMode
              ? 'This pre-test is just to see what you already know.'
              : passed
                ? 'You passed!'
                : `Need ${passingScore}% to unlock next section`}
          </p>

          {!passed && !diagnosticMode && (
            <p className="text-sm text-muted-foreground mb-4">
              Review the concepts and try again. Focus on ATP, organelles, and energy flow!
            </p>
          )}

          <div className="flex gap-3">
            {!passed && allowRetry && !diagnosticMode && (
              <button onClick={handleRetry} className="flex-1 px-4 py-2 rounded-lg border-2 border-primary/20 font-semibold">
                <RotateCcw className="w-4 h-4 inline mr-1" /> Retry
              </button>
            )}
            <button onClick={handleContinue} className="flex-1 btn-nature">
              {passed ? 'Continue' : 'Review'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
