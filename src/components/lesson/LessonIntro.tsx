import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle } from 'lucide-react';

interface LessonIntroProps {
  title: string;
  subtitle: string;
  description?: string;
  icon: ReactNode;
  totalSections: number;
  completedSections: number;
  onStartLesson: () => void;
  onBack?: () => void;
  isLessonCompleted?: boolean;
  hasLessonEverStarted?: boolean;
}

export function LessonIntro({
  title,
  subtitle,
  description,
  icon,
  totalSections,
  completedSections,
  onStartLesson,
  onBack,
  isLessonCompleted = false,
  hasLessonEverStarted = true,
}: LessonIntroProps) {
  // If the lesson has never been started, ignore any stale localStorage data and show 0%
  // This prevents showing 99% progress on a lesson that hasn't been started yet
  const effectiveCompletedSections = hasLessonEverStarted ? completedSections : 0;
  
  const safeCompletedSections = Math.min(Math.max(effectiveCompletedSections, 0), totalSections);
  const rawProgress = totalSections > 0 ? (safeCompletedSections / totalSections) * 100 : 0;
  // Only allow a full 100% when the lesson is actually marked completed
  // Cap at 99% to prevent showing 100% for technically complete but unfinalized lessons
  const progress = isLessonCompleted ? Math.min(rawProgress, 100) : Math.min(rawProgress, 99);
  const isResuming = safeCompletedSections > 0 && safeCompletedSections < totalSections;
  const isCompleted = isLessonCompleted;
  const statusLabel = isCompleted
    ? 'Lesson completed'
    : isResuming
      ? 'In progress'
      : 'Ready to start';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-background to-muted/40">
      <div className="w-full max-w-xl text-center space-y-8 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
            {subtitle}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Progress Info */}
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
            <span>{totalSections} sections</span>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary border border-primary/15">
                {statusLabel}
              </span>
              <span className="font-semibold text-primary">
                {Math.round(progress)}% complete
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={onStartLesson}
          className="gap-3 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/10"
        >
          <PlayCircle className="w-5 h-5" />
          {isCompleted ? 'Review Lesson' : isResuming ? 'Continue Lesson' : 'Start Lesson'}
        </Button>

        {/* Back link */}
        {onBack && (
          <button
            onClick={onBack}
            className="block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
