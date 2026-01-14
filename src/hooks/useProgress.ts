import { useState, useEffect } from 'react';

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
  studentName: 'Czaryssa',
  preTestScore: null,
  preTestCompleted: false,
  postTestScore: null,
  postTestCompleted: false,
  lessons: {
    lesson1: { completed: false, score: 0, assessmentCompleted: false },
    lesson2: { completed: false, score: 0, assessmentCompleted: false },
    lesson3: { completed: false, score: 0, assessmentCompleted: false },
  },
  unlockedTabs: ['welcome', 'pretest', 'lesson1', 'lesson2', 'lesson3'],
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

  const updateProgress = (updates: Partial<Progress>) => {
    setProgress((prev) => {
      const newProgress = { ...prev, ...updates };
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
  };

  const completePreTest = (score: number) => {
    const passed = score >= 15; // 50% of 30
    const newUnlocked = passed 
      ? [...progress.unlockedTabs, 'lesson1'] 
      : progress.unlockedTabs;
    updateProgress({
      preTestScore: score,
      preTestCompleted: true,
      unlockedTabs: [...new Set(newUnlocked)],
    });
    return passed;
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
