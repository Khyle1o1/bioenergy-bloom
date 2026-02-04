import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from './useProgress';

export function useProgressSync(
  progress: Progress,
  updateLocalProgress: (updates: Partial<Progress>) => void
) {
  const { user } = useAuth();

  // Sync local progress to database
  const syncToDatabase = useCallback(async () => {
    if (!user) return;

    try {
      await supabase
        .from('student_progress')
        .update({
          pre_test_score: progress.preTestScore,
          pre_test_completed: progress.preTestCompleted,
          post_test_score: progress.postTestScore,
          post_test_completed: progress.postTestCompleted,
          lesson1_completed: progress.lessons.lesson1.completed,
          lesson1_score: progress.lessons.lesson1.score,
          lesson1_assessment_completed: progress.lessons.lesson1.assessmentCompleted,
          lesson2_completed: progress.lessons.lesson2.completed,
          lesson2_score: progress.lessons.lesson2.score,
          lesson2_assessment_completed: progress.lessons.lesson2.assessmentCompleted,
          lesson3_completed: progress.lessons.lesson3.completed,
          lesson3_score: progress.lessons.lesson3.score,
          lesson3_assessment_completed: progress.lessons.lesson3.assessmentCompleted,
          total_progress: progress.totalProgress,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } catch (error) {
      const err = error as { message?: string; code?: string };
      console.error('[ProgressSync] Error syncing progress:', err?.message ?? err, err);
    }
  }, [user, progress]);

  // Load progress from database on login
  const loadFromDatabase = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Get user's name from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .maybeSingle();

        updateLocalProgress({
          studentName: profile?.full_name || 'user',
          preTestScore: data.pre_test_score,
          preTestCompleted: data.pre_test_completed,
          postTestScore: data.post_test_score,
          postTestCompleted: data.post_test_completed,
          lessons: {
            lesson1: {
              completed: data.lesson1_completed,
              score: data.lesson1_score,
              assessmentCompleted: data.lesson1_assessment_completed
            },
            lesson2: {
              completed: data.lesson2_completed,
              score: data.lesson2_score,
              assessmentCompleted: data.lesson2_assessment_completed
            },
            lesson3: {
              completed: data.lesson3_completed,
              score: data.lesson3_score,
              assessmentCompleted: data.lesson3_assessment_completed
            }
          },
          totalProgress: data.total_progress
        });
      }
    } catch (error) {
      const err = error as { message?: string; code?: string };
      console.error('[ProgressSync] Error loading progress:', err?.message ?? err, err);
    }
  }, [user, updateLocalProgress]);

  // Load from database when user logs in
  useEffect(() => {
    if (user) {
      loadFromDatabase();
    }
  }, [user, loadFromDatabase]);

  // Sync to database when progress changes (debounced)
  useEffect(() => {
    if (!user) return;

    const timeoutId = setTimeout(() => {
      syncToDatabase();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [user, progress, syncToDatabase]);

  return { syncToDatabase, loadFromDatabase };
}
