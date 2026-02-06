import { useState, useEffect, useCallback } from 'react';

export interface LessonProgress {
  completed: boolean;
  score: number;
  assessmentCompleted: boolean;
}

export interface Progress {
  studentName: string;
  preTestScore: number | null;
  preTestCompleted: boolean;
  postTestScore: number | null;
  postTestCompleted: boolean;
  lessons: {
    lesson1: LessonProgress;
    lesson2: LessonProgress;
    lesson3: LessonProgress;
  };
  unlockedTabs: string[];
  totalProgress: number;
}

const DEFAULT_PROGRESS: Progress = {
  studentName: 'user',
  preTestScore: null,
  preTestCompleted: false,
  postTestScore: null,
  postTestCompleted: false,
  lessons: {
    lesson1: { completed: false, score: 0, assessmentCompleted: false },
    lesson2: { completed: false, score: 0, assessmentCompleted: false },
    lesson3: { completed: false, score: 0, assessmentCompleted: false },
  },
  // Initially, only Home and Pre-Test are available.
  // Lessons unlock progressively after passing requirements.
  unlockedTabs: ['welcome', 'pretest'],
  totalProgress: 0,
};

const STORAGE_KEY = 'bioenergy_progress';

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
    } catch {
      return DEFAULT_PROGRESS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateProgress = useCallback((updates: Partial<Progress>) => {
    setProgress((prev) => {
      const newProgress: Progress = {
        ...prev,
        ...updates,
        lessons: {
          ...prev.lessons,
          ...(updates.lessons || {}),
        },
      };

      // Recompute which tabs should be unlocked based on progress.
      // This makes sure that loading progress from the database
      // (which doesn't store unlockedTabs) still correctly unlocks
      // the appropriate lessons and assessments.
      const unlocked = new Set<string>(['welcome', 'pretest']);

      if (newProgress.preTestCompleted) {
        unlocked.add('lesson1');
      }
      if (newProgress.lessons.lesson1.completed) {
        unlocked.add('lesson2');
      }
      if (newProgress.lessons.lesson2.completed) {
        unlocked.add('lesson3');
      }
      if (newProgress.lessons.lesson3.completed) {
        unlocked.add('posttest');
      }
      if (newProgress.postTestCompleted) {
        unlocked.add('project');
      }

      newProgress.unlockedTabs = Array.from(unlocked);

      // Calculate total progress
      let total = 0;
      if (newProgress.preTestCompleted) total += 15;
      if (newProgress.lessons.lesson1.completed) total += 20;
      if (newProgress.lessons.lesson2.completed) total += 20;
      if (newProgress.lessons.lesson3.completed) total += 20;
      if (newProgress.postTestCompleted) total += 25;
      newProgress.totalProgress = total;

      return newProgress;
    });
  }, []);

  const completePreTest = (score: number) => {
    // Pre-test is diagnostic only. Completing it once unlocks Lesson 1
    // regardless of score.
    const newUnlocked = [...progress.unlockedTabs, 'lesson1'];
    updateProgress({
      preTestScore: score,
      preTestCompleted: true,
      unlockedTabs: [...new Set(newUnlocked)],
    });
    return true;
  };

  const completeLesson = (lessonKey: 'lesson1' | 'lesson2' | 'lesson3', score: number) => {
    const passed = score >= 80;
    const nextTab = {
      lesson1: 'lesson2',
      lesson2: 'lesson3',
      lesson3: 'posttest',
    }[lessonKey];

    const newUnlocked = passed
      ? [...progress.unlockedTabs, nextTab]
      : progress.unlockedTabs;

    updateProgress({
      lessons: {
        ...progress.lessons,
        [lessonKey]: { completed: passed, score, assessmentCompleted: true },
      },
      unlockedTabs: [...new Set(newUnlocked)],
    });
    return passed;
  };

  const completePostTest = (score: number) => {
    const newUnlocked = [...progress.unlockedTabs, 'project'];
    updateProgress({
      postTestScore: score,
      postTestCompleted: true,
      unlockedTabs: [...new Set(newUnlocked)],
    });
  };

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isTabUnlocked = (tabId: string) => progress.unlockedTabs.includes(tabId);

  return {
    progress,
    updateProgress,
    completePreTest,
    completeLesson,
    completePostTest,
    resetProgress,
    isTabUnlocked,
  };
}
