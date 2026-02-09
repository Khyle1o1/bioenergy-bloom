import { useState, useEffect, useCallback } from 'react';

const CURRENT_SECTION_KEY_PREFIX = 'lesson_current_section_';

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
  const storageKey = `${CURRENT_SECTION_KEY_PREFIX}${lessonId}`;

  // Track whether we're in slide mode (lesson started) or intro mode
  const [isLessonStarted, setIsLessonStarted] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null;
    } catch {
      return false;
    }
  });

  const [currentSectionIndex, setCurrentSectionIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const index = parseInt(saved, 10);
        return isNaN(index) ? 0 : Math.min(index, totalSections - 1);
      }
      return 0;
    } catch {
      return 0;
    }
  });

  // Persist current section
  useEffect(() => {
    if (isLessonStarted) {
      try {
        localStorage.setItem(storageKey, String(currentSectionIndex));
      } catch {
        // ignore
      }
    }
  }, [currentSectionIndex, isLessonStarted, storageKey]);

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
    // If there's progress, resume from last incomplete or current position
    // Otherwise start from beginning
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
  
  // Check if the lesson has ever been started (has stored section position)
  const hasLessonEverStarted = (() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null;
    } catch {
      return false;
    }
  })();

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

