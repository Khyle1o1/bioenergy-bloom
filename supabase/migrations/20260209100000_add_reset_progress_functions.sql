-- Function to reset entire student progress
CREATE OR REPLACE FUNCTION public.reset_student_progress(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to reset progress
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reset student progress';
  END IF;
  -- Reset all progress fields to default
  UPDATE public.student_progress
  SET
    pre_test_score = NULL,
    pre_test_completed = false,
    post_test_score = NULL,
    post_test_completed = false,
    lesson1_completed = false,
    lesson1_score = 0,
    lesson1_assessment_completed = false,
    lesson2_completed = false,
    lesson2_score = 0,
    lesson2_assessment_completed = false,
    lesson3_completed = false,
    lesson3_score = 0,
    lesson3_assessment_completed = false,
    total_progress = 0,
    last_activity = now(),
    updated_at = now()
  WHERE user_id = target_user_id;

  -- Delete all answer logs for this student
  DELETE FROM public.answer_logs
  WHERE user_id = target_user_id;
END;
$$;

-- Function to reset pre-test only
CREATE OR REPLACE FUNCTION public.reset_student_pretest(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total_progress INTEGER;
BEGIN
  -- Only allow admins to reset progress
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reset student progress';
  END IF;

  -- Reset pre-test
  UPDATE public.student_progress
  SET
    pre_test_score = NULL,
    pre_test_completed = false,
    last_activity = now(),
    updated_at = now()
  WHERE user_id = target_user_id
  RETURNING total_progress - 15 INTO new_total_progress;

  -- Update total progress (remove 15% for pre-test)
  UPDATE public.student_progress
  SET total_progress = GREATEST(0, new_total_progress)
  WHERE user_id = target_user_id;

  -- Delete pre-test answer logs
  DELETE FROM public.answer_logs
  WHERE user_id = target_user_id
    AND activity_type = 'pretest';
END;
$$;

-- Function to reset a specific lesson
CREATE OR REPLACE FUNCTION public.reset_student_lesson(target_user_id UUID, lesson_number INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  progress_reduction INTEGER := 20;
  new_total_progress INTEGER;
  lesson_quiz_type TEXT;
BEGIN
  -- Only allow admins to reset progress
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reset student progress';
  END IF;

  -- Validate lesson number
  IF lesson_number NOT IN (1, 2, 3) THEN
    RAISE EXCEPTION 'Invalid lesson number. Must be 1, 2, or 3';
  END IF;

  -- Determine activity type for answer logs
  lesson_quiz_type := 'lesson' || lesson_number || '_quiz';

  -- Reset the specific lesson
  IF lesson_number = 1 THEN
    UPDATE public.student_progress
    SET
      lesson1_completed = false,
      lesson1_score = 0,
      lesson1_assessment_completed = false,
      last_activity = now(),
      updated_at = now()
    WHERE user_id = target_user_id
    RETURNING total_progress - progress_reduction INTO new_total_progress;
  ELSIF lesson_number = 2 THEN
    UPDATE public.student_progress
    SET
      lesson2_completed = false,
      lesson2_score = 0,
      lesson2_assessment_completed = false,
      last_activity = now(),
      updated_at = now()
    WHERE user_id = target_user_id
    RETURNING total_progress - progress_reduction INTO new_total_progress;
  ELSIF lesson_number = 3 THEN
    UPDATE public.student_progress
    SET
      lesson3_completed = false,
      lesson3_score = 0,
      lesson3_assessment_completed = false,
      last_activity = now(),
      updated_at = now()
    WHERE user_id = target_user_id
    RETURNING total_progress - progress_reduction INTO new_total_progress;
  END IF;

  -- Update total progress (remove 20% for the lesson)
  UPDATE public.student_progress
  SET total_progress = GREATEST(0, new_total_progress)
  WHERE user_id = target_user_id;

  -- Delete lesson-related answer logs
  DELETE FROM public.answer_logs
  WHERE user_id = target_user_id
    AND (activity_type = lesson_quiz_type OR 
         (activity_type = 'matching' AND lesson_id = 'lesson' || lesson_number) OR
         (activity_type = 'text_response' AND lesson_id = 'lesson' || lesson_number));
END;
$$;

-- Function to reset post-test only
CREATE OR REPLACE FUNCTION public.reset_student_posttest(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_total_progress INTEGER;
BEGIN
  -- Only allow admins to reset progress
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can reset student progress';
  END IF;

  -- Reset post-test
  UPDATE public.student_progress
  SET
    post_test_score = NULL,
    post_test_completed = false,
    last_activity = now(),
    updated_at = now()
  WHERE user_id = target_user_id
  RETURNING total_progress - 25 INTO new_total_progress;

  -- Update total progress (remove 25% for post-test)
  UPDATE public.student_progress
  SET total_progress = GREATEST(0, new_total_progress)
  WHERE user_id = target_user_id;

  -- Delete post-test answer logs
  DELETE FROM public.answer_logs
  WHERE user_id = target_user_id
    AND activity_type = 'posttest';
END;
$$;

-- Grant execute permissions to authenticated users (will be checked by has_role inside functions)
GRANT EXECUTE ON FUNCTION public.reset_student_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_student_pretest(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_student_lesson(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_student_posttest(UUID) TO authenticated;
