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
}: LessonIntroProps) {
  const progress = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
  const isResuming = completedSections > 0 && completedSections < totalSections;
  const isCompleted = completedSections === totalSections;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-background to-muted/30">
      <div className="w-full max-w-lg text-center space-y-8 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {subtitle}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Progress Info */}
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{totalSections} sections</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={onStartLesson}
          className="gap-3 px-8 py-6 text-base font-semibold"
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
