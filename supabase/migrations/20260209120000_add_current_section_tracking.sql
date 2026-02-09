-- Add current section tracking for each lesson
-- This allows students to resume exactly where they left off

ALTER TABLE public.student_progress
ADD COLUMN IF NOT EXISTS lesson1_current_section INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lesson2_current_section INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lesson3_current_section INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lesson1_sections_done TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS lesson2_sections_done TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS lesson3_sections_done TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.student_progress.lesson1_current_section IS 'Current section index (0-based) for Lesson 1';
COMMENT ON COLUMN public.student_progress.lesson2_current_section IS 'Current section index (0-based) for Lesson 2';
COMMENT ON COLUMN public.student_progress.lesson3_current_section IS 'Current section index (0-based) for Lesson 3';
COMMENT ON COLUMN public.student_progress.lesson1_sections_done IS 'Array of completed section IDs for Lesson 1';
COMMENT ON COLUMN public.student_progress.lesson2_sections_done IS 'Array of completed section IDs for Lesson 2';
COMMENT ON COLUMN public.student_progress.lesson3_sections_done IS 'Array of completed section IDs for Lesson 3';
