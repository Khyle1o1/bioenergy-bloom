-- Fix: permission denied for schema public (42501)
-- Supabase requires both RLS policies AND SQL grants for anon/authenticated roles.

-- Allow PostgREST roles to use the public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table privileges (RLS still enforces row-level access)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Ensure future tables inherit the same privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO anon;

-- If you use sequences (e.g. serial ids), grant usage as well (safe even if none exist)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

