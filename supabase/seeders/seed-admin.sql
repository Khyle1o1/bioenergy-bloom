-- Seeder to partially create an admin account
-- This assumes the auth user already exists in auth.users
-- Run this after creating a user via Supabase Auth or manually

-- Example: To use this seeder, first create a user in Supabase Auth dashboard
-- Then replace 'USER_ID_HERE' with the actual user ID from auth.users

-- Option 1: If you have a specific user ID
-- Replace 'USER_ID_HERE' with the actual UUID from auth.users table
DO $$
DECLARE
  target_user_id UUID;
  admin_email TEXT := 'qwertysky62@gmail.com'; -- Change this to your admin email
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = admin_email
  LIMIT 1;

  -- If user found, create admin profile and role
  IF target_user_id IS NOT NULL THEN
    -- Create or update profile
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (target_user_id, 'System Administrator', admin_email)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      full_name = 'System Administrator',
      email = admin_email,
      updated_at = now();

    -- Create or update admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) 
    DO UPDATE SET role = 'admin';

    -- Create or update student progress (required by schema)
    INSERT INTO public.student_progress (user_id)
    VALUES (target_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE 'Admin account created/updated for user: %', admin_email;
  ELSE
    RAISE NOTICE 'User with email % not found in auth.users. Please create the user first.', admin_email;
  END IF;
END $$;

-- Option 2: Create admin for a specific user ID (uncomment and replace UUID)
/*
DO $$
DECLARE
  target_user_id UUID := 'USER_ID_HERE'::UUID; -- Replace with actual UUID
BEGIN
  -- Create or update profile
  INSERT INTO public.profiles (user_id, full_name, email)
  SELECT id, 'System Administrator', email
  FROM auth.users
  WHERE id = target_user_id
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    full_name = 'System Administrator',
    email = (SELECT email FROM auth.users WHERE id = target_user_id),
    updated_at = now();

  -- Create or update admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) 
  DO UPDATE SET role = 'admin';

  -- Create or update student progress
  INSERT INTO public.student_progress (user_id)
  VALUES (target_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  RAISE NOTICE 'Admin account created/updated for user ID: %', target_user_id;
END $$;
*/

-- Option 3: Promote the first user in the system to admin (useful for initial setup)
/*
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  -- Get the first user (oldest user)
  SELECT id INTO first_user_id
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1;

  IF first_user_id IS NOT NULL THEN
    -- Update role to admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (first_user_id, 'admin')
    ON CONFLICT (user_id, role) 
    DO UPDATE SET role = 'admin';

    -- Update profile name
    UPDATE public.profiles
    SET full_name = COALESCE(full_name, 'System Administrator')
    WHERE user_id = first_user_id;

    RAISE NOTICE 'First user promoted to admin: %', first_user_id;
  END IF;
END $$;
*/
