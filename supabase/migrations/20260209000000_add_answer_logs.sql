-- Create answer_logs table to store all learner answers
CREATE TABLE IF NOT EXISTS public.answer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL, -- 'pretest', 'posttest', 'lesson1_quiz', 'lesson2_quiz', 'lesson3_quiz', 'matching', 'text_response'
  activity_name TEXT NOT NULL, -- e.g., 'Pre-Test Question 1', 'Lesson 1 Matching Activity', 'PAIR Activity'
  lesson_id TEXT, -- 'lesson1', 'lesson2', 'lesson3', or NULL for tests
  question_id TEXT, -- question identifier
  question_text TEXT, -- the actual question
  selected_answer TEXT, -- learner's answer
  correct_answer TEXT, -- correct answer (NULL for open-ended)
  is_correct BOOLEAN, -- whether answer was correct (NULL for open-ended)
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_answer_logs_user_id ON public.answer_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_answer_logs_activity_type ON public.answer_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_answer_logs_timestamp ON public.answer_logs(timestamp DESC);

-- Enable RLS
ALTER TABLE public.answer_logs ENABLE ROW LEVEL SECURITY;

-- Users can view and insert their own answer logs
DROP POLICY IF EXISTS "Users can view own answer logs" ON public.answer_logs;
CREATE POLICY "Users can view own answer logs" ON public.answer_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own answer logs" ON public.answer_logs;
CREATE POLICY "Users can insert own answer logs" ON public.answer_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all answer logs
DROP POLICY IF EXISTS "Admins can view all answer logs" ON public.answer_logs;
CREATE POLICY "Admins can view all answer logs" ON public.answer_logs
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
