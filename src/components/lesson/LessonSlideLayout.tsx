import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LessonSlideLayoutProps {
  children: ReactNode;
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
  lessonLabel?: string;
  onNext: () => void;
  onBack: () => void;
  onFinish?: () => void;
  onExit?: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
  canProceed?: boolean;
  currentSectionId?: string;
  onMarkSectionComplete?: (sectionId: string) => void;
}

export function LessonSlideLayout({
  children,
  currentSection,
  totalSections,
  sectionTitle,
  lessonLabel,
  onNext,
  onBack,
  onFinish,
  onExit,
  isFirstSection,
  isLastSection,
  canProceed = true,
  currentSectionId,
  onMarkSectionComplete,
}: LessonSlideLayoutProps) {
  const progressPercent = ((currentSection + 1) / totalSections) * 100;

  const handleNext = () => {
    // Mark current section as complete before moving to next
    if (currentSectionId && onMarkSectionComplete) {
      onMarkSectionComplete(currentSectionId);
    }
    
    if (isLastSection && onFinish) {
      onFinish();
    } else {
      onNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header with progress */}
      <header className="flex-shrink-0 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex flex-col">
              {lessonLabel && (
                <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {lessonLabel}
                </span>
              )}
              <span className="text-xs font-medium text-muted-foreground">
                Section {currentSection + 1} of {totalSections}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-primary">
                {Math.round(progressPercent)}% Complete
              </span>
              {onExit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExit}
                  className="h-7 px-2 text-xs"
                >
                  Home
                </Button>
              )}
            </div>
          </div>
          <Progress value={progressPercent} className="h-1.5" />
          <h2 className="mt-3 text-lg font-semibold text-foreground">{sectionTitle}</h2>
        </div>
      </header>

      {/* Main content area - scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>

      {/* Navigation footer */}
      <footer className="flex-shrink-0 border-t border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              disabled={isFirstSection}
              className={cn(
                "gap-2 transition-opacity",
                isFirstSection && "opacity-0 pointer-events-none"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex gap-1.5">
              {Array.from({ length: totalSections }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    i === currentSection
                      ? "bg-primary"
                      : i < currentSection
                      ? "bg-primary/40"
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="gap-2"
            >
              {isLastSection ? 'Finish Lesson' : 'Next'}
              {!isLastSection && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
