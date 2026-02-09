-- Quick check to verify answer_logs table exists and has correct structure

-- 1. Check if table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = 'answer_logs'
    ) THEN '✅ answer_logs table EXISTS'
    ELSE '❌ answer_logs table MISSING - Run migration!'
  END as table_status;

-- 2. Check table structure (only if table exists)
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'answer_logs'
ORDER BY ordinal_position;

-- 3. Check if there are any answer logs
SELECT 
  activity_type,
  COUNT(*) as count
FROM answer_logs
GROUP BY activity_type
ORDER BY activity_type;

-- 4. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'answer_logs';

-- 5. Sample answer logs (if any exist)
SELECT 
  user_id,
  activity_type,
  activity_name,
  question_text,
  is_correct,
  timestamp
FROM answer_logs
ORDER BY timestamp DESC
LIMIT 5;
