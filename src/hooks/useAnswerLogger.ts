import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/useAuth';

export interface AnswerLogEntry {
  activity_type: 'pretest' | 'posttest' | 'lesson1_quiz' | 'lesson2_quiz' | 'lesson3_quiz' | 'matching' | 'text_response';
  activity_name: string;
  lesson_id?: string;
  question_id: string;
  question_text: string;
  selected_answer: string;
  correct_answer?: string;
  is_correct?: boolean;
}

export function useAnswerLogger() {
  const { user } = useAuth();

  const logAnswer = async (entry: AnswerLogEntry) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('answer_logs').insert({
        user_id: user.id,
        activity_type: entry.activity_type,
        activity_name: entry.activity_name,
        lesson_id: entry.lesson_id || null,
        question_id: entry.question_id,
        question_text: entry.question_text,
        selected_answer: entry.selected_answer,
        correct_answer: entry.correct_answer || null,
        is_correct: entry.is_correct !== undefined ? entry.is_correct : null,
      });

      if (error) {
        console.error('Error logging answer:', error);
      }
    } catch (error) {
      console.error('Error logging answer:', error);
    }
  };

  const logMultipleAnswers = async (entries: AnswerLogEntry[]) => {
    if (!user || entries.length === 0) return;

    try {
      const records = entries.map((entry) => ({
        user_id: user.id,
        activity_type: entry.activity_type,
        activity_name: entry.activity_name,
        lesson_id: entry.lesson_id || null,
        question_id: entry.question_id,
        question_text: entry.question_text,
        selected_answer: entry.selected_answer,
        correct_answer: entry.correct_answer || null,
        is_correct: entry.is_correct !== undefined ? entry.is_correct : null,
      }));

      const { error } = await supabase.from('answer_logs').insert(records);

      if (error) {
        console.error('Error logging multiple answers:', error);
      }
    } catch (error) {
      console.error('Error logging multiple answers:', error);
    }
  };

  return { logAnswer, logMultipleAnswers };
}
