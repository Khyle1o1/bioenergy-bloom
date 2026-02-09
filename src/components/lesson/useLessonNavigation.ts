import { useState, useEffect, useCallback } from 'react';

interface UseLessonNavigationOptions {
  lessonId: string;
  totalSections: number;
  sectionsDone: string[];
  sectionIds: readonly string[];
  onSectionChange?: (sectionIndex: number) => void;
}

export function useLessonNavigation({
  lessonId,
  totalSections,
  sectionsDone,
  sectionIds,
  onSectionChange,
}: UseLessonNavigationOptions) {
  // NO localStorage - everything in memory only
  const [isLessonStarted, setIsLessonStarted] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

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
    // Always start from beginning or first incomplete section
    const firstIncompleteIndex = sectionIds.findIndex(id => !sectionsDone.includes(id));
    const startIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
    
    setCurrentSectionIndex(startIndex);
    setIsLessonStarted(true);
    onSectionChange?.(startIndex);
  }, [sectionsDone, sectionIds, onSectionChange]);

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
  const completedSectionsCount = sectionsDone.length;
  
  // Check if the lesson has ever been started by checking if any sections are completed
  // This is more reliable than localStorage which can have stale data
  const hasLessonEverStarted = sectionsDone.length > 0;

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

