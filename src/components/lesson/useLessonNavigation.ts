import { useState, useEffect, useCallback } from 'react';

interface UseLessonNavigationOptions {
  lessonId: string;
  totalSections: number;
  sectionsDone: string[];
  sectionIds: readonly string[];
  initialSection?: number; // Resume from this section if provided
  onSectionChange?: (sectionIndex: number) => void;
  savedCurrentSection?: number; // For checking if lesson has ever been started
}

export function useLessonNavigation({
  lessonId,
  totalSections,
  sectionsDone,
  sectionIds,
  initialSection = 0,
  onSectionChange,
  savedCurrentSection = 0,
}: UseLessonNavigationOptions) {
  // NO localStorage - everything in memory only
  const [isLessonStarted, setIsLessonStarted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(initialSection);

  // Keyboard navigation
  useEffect(() => {
    if (!isLessonStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLessonStarted, currentSectionIndex, totalSections]);

  const startLesson = useCallback(() => {
    // If there's a saved current section (initialSection), use that
    // Otherwise, find first incomplete section or start from beginning
    let startIndex = initialSection;
    
    // But if the saved section is already done, find the next incomplete one
    if (startIndex > 0 && sectionIds[startIndex] && sectionsDone.includes(sectionIds[startIndex])) {
      const firstIncompleteIndex = sectionIds.findIndex(id => !sectionsDone.includes(id));
      startIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
    }
    
    setCurrentSectionIndex(startIndex);
    setIsLessonStarted(true);
    onSectionChange?.(startIndex);
  }, [initialSection, sectionsDone, sectionIds, onSectionChange]);

  const exitLesson = useCallback(() => {
    setIsLessonStarted(false);
  }, []);

  const goToNext = useCallback(() => {
    if (currentSectionIndex < totalSections - 1) {
      const next = currentSectionIndex + 1;
      setCurrentSectionIndex(next);
      onSectionChange?.(next);
    }
  }, [currentSectionIndex, totalSections, onSectionChange]);

  const goToPrevious = useCallback(() => {
    if (currentSectionIndex > 0) {
      const prev = currentSectionIndex - 1;
      setCurrentSectionIndex(prev);
      onSectionChange?.(prev);
    }
  }, [currentSectionIndex, onSectionChange]);

  const goToSection = useCallback((index: number) => {
    if (index >= 0 && index < totalSections) {
      setCurrentSectionIndex(index);
      onSectionChange?.(index);
    }
  }, [totalSections, onSectionChange]);

  const currentSectionId = sectionIds[currentSectionIndex];
  const isCurrentSectionDone = sectionsDone.includes(currentSectionId);
  
  // Calculate completed sections count intelligently:
  // If sectionsDone is empty but savedCurrentSection > 0, estimate based on current section
  const completedSectionsCount = sectionsDone.length > 0 
    ? sectionsDone.length 
    : savedCurrentSection > 0 
      ? savedCurrentSection 
      : 0;
  
  // Check if the lesson has ever been started by checking sections completed OR current section
  // This handles cases where migration wasn't applied yet (no sectionsDone but has currentSection)
  const hasLessonEverStarted = sectionsDone.length > 0 || savedCurrentSection > 0;

  return {
    isLessonStarted,
    currentSectionIndex,
    currentSectionId,
    isCurrentSectionDone,
    completedSectionsCount,
    hasLessonEverStarted,
    isFirstSection: currentSectionIndex === 0,
    isLastSection: currentSectionIndex === totalSections - 1,
    startLesson,
    exitLesson,
    goToNext,
    goToPrevious,
    goToSection,
  };
}

