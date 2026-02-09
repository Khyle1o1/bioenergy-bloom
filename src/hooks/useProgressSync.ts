import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from './useProgress';

export function useProgressSync(
  progress: Progress,
  updateLocalProgress: (updates: Partial<Progress>) => void
) {
  const { user } = useAuth();
  
  // Track if we have unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync local progress to database
  const syncToDatabase = useCallback(async () => {
    if (!user) return;

    try {
      console.log('[ProgressSync] Saving to database:', {
        lesson1_current_section: progress.lessons.lesson1.currentSection,
        lesson1_sections_done: progress.lessons.lesson1.sectionsDone,
        lesson2_current_section: progress.lessons.lesson2.currentSection,
        lesson2_sections_done: progress.lessons.lesson2.sectionsDone,
      });
      
      const { error } = await supabase
        .from('student_progress')
        .update({
          pre_test_score: progress.preTestScore,
          pre_test_completed: progress.preTestCompleted,
          post_test_score: progress.postTestScore,
          post_test_completed: progress.postTestCompleted,
          lesson1_completed: progress.lessons.lesson1.completed,
          lesson1_score: progress.lessons.lesson1.score,
          lesson1_assessment_completed: progress.lessons.lesson1.assessmentCompleted,
          lesson1_current_section: progress.lessons.lesson1.currentSection,
          lesson1_sections_done: progress.lessons.lesson1.sectionsDone,
          lesson2_completed: progress.lessons.lesson2.completed,
          lesson2_score: progress.lessons.lesson2.score,
          lesson2_assessment_completed: progress.lessons.lesson2.assessmentCompleted,
          lesson2_current_section: progress.lessons.lesson2.currentSection,
          lesson2_sections_done: progress.lessons.lesson2.sectionsDone,
          lesson3_completed: progress.lessons.lesson3.completed,
          lesson3_score: progress.lessons.lesson3.score,
          lesson3_assessment_completed: progress.lessons.lesson3.assessmentCompleted,
          lesson3_current_section: progress.lessons.lesson3.currentSection,
          lesson3_sections_done: progress.lessons.lesson3.sectionsDone,
          total_progress: progress.totalProgress,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      console.log('[ProgressSync] ✅ Saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      const err = error as { message?: string; code?: string };
      console.error('[ProgressSync] ❌ Error syncing progress:', err?.message ?? err, err);
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

        console.log('[ProgressSync] Loading progress from database:', {
          lesson1_current_section: data.lesson1_current_section,
          lesson1_sections_done: data.lesson1_sections_done,
          lesson2_current_section: data.lesson2_current_section,
          lesson2_sections_done: data.lesson2_sections_done,
        });

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
              assessmentCompleted: data.lesson1_assessment_completed,
              currentSection: data.lesson1_current_section ?? 0,
              sectionsDone: data.lesson1_sections_done ?? []
            },
            lesson2: {
              completed: data.lesson2_completed,
              score: data.lesson2_score,
              assessmentCompleted: data.lesson2_assessment_completed,
              currentSection: data.lesson2_current_section ?? 0,
              sectionsDone: data.lesson2_sections_done ?? []
            },
            lesson3: {
              completed: data.lesson3_completed,
              score: data.lesson3_score,
              assessmentCompleted: data.lesson3_assessment_completed,
              currentSection: data.lesson3_current_section ?? 0,
              sectionsDone: data.lesson3_sections_done ?? []
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

  // Mark that we have unsaved changes whenever progress changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [progress]);

  // Sync to database when progress changes (debounced)
  useEffect(() => {
    if (!user || !hasUnsavedChanges) return;

    const timeoutId = setTimeout(() => {
      syncToDatabase();
    }, 100); // Very short debounce for faster sync

    return () => clearTimeout(timeoutId);
  }, [user, hasUnsavedChanges, syncToDatabase]);
  
  // Flush unsaved changes when user navigates away or closes tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasUnsavedChanges) {
        syncToDatabase();
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, syncToDatabase]);

  // Setup realtime subscription to listen for progress resets from admin
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('student_progress_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'student_progress',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Clear lesson-related localStorage when progress is reset
          try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && (
                key.startsWith('lesson') || 
                key.includes('sections_done') ||
                key.includes('current_section')
              )) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
          } catch (error) {
            console.error('Error clearing lesson localStorage:', error);
          }
          
          // Reload progress when admin makes changes
          loadFromDatabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadFromDatabase]);

  // Expose function to force immediate sync (for when user exits lesson)
  const forceSyncNow = useCallback(async () => {
    if (hasUnsavedChanges) {
      await syncToDatabase();
    }
  }, [hasUnsavedChanges, syncToDatabase]);

  return { syncToDatabase, loadFromDatabase, forceSyncNow };
}
