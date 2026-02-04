# Guide: Migrating to a New Supabase Project

This guide will walk you through switching from your current Supabase project to a new one.

## Prerequisites

Before starting, make sure you have:
1. **New Supabase Project** created at [supabase.com](https://supabase.com)
2. **New Project Credentials** from your Supabase dashboard:
   - Project URL
   - Anon/Public Key (publishable key)
   - Service Role Key (for Edge Functions)

## Step 1: Get Your New Supabase Credentials

1. Go to your new Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (this is your `VITE_SUPABASE_PUBLISHABLE_KEY`)
   - **service_role** key (keep this secret - used for Edge Functions)

## Step 2: Update Local Environment Variables

Create or update your `.env` file in the project root with your new credentials:

```env
VITE_SUPABASE_URL=https://your-new-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-new-anon-key-here
```

**Note:** The `.env` file is already in `.gitignore`, so it won't be committed to git.

## Step 3: Update Supabase Config File

Update `supabase/config.toml` with your new project ID:

1. In your Supabase dashboard, go to **Settings** → **General**
2. Find your **Project ID** (it's a short string like `abcdefghijklmnop`)
3. Update the `project_id` in `supabase/config.toml`:

```toml
project_id = "your-new-project-id-here"
```

## Step 4: Link Your Local Project to New Supabase

If you're using Supabase CLI, link your local project:

```bash
# First, make sure you're logged in
supabase login

# Link to your new project
supabase link --project-ref your-new-project-id-here
```

## Step 5: Set Edge Function Environment Variables

Your Edge Functions (`admin-users` and `seed-admin`) need environment variables set in Supabase:

1. Go to your Supabase dashboard
2. Navigate to **Edge Functions** → **Settings**
3. Add the following secrets:
   - `SUPABASE_URL` = Your project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
   - `SUPABASE_ANON_KEY` = Your anon/public key

Alternatively, you can set them via CLI:

```bash
supabase secrets set SUPABASE_URL=https://your-new-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set SUPABASE_ANON_KEY=your-anon-key
```

## Step 6: Run Database Migrations

Apply your database schema to the new project:

```bash
# Push migrations to your new Supabase project
supabase db push
```

Or if you prefer to run migrations manually:
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/migrations/20260202101941_ce4e7593-c093-495a-9645-059b6c66f36d.sql`
3. Run it in the SQL Editor

## Step 7: Deploy Edge Functions (if needed)

If you've made changes to Edge Functions, deploy them:

```bash
supabase functions deploy admin-users
supabase functions deploy seed-admin
```

## Step 8: Seed Initial Admin User (Optional)

If you need to create an admin user in the new project:

```bash
# Call the seed-admin function
curl -X POST https://your-new-project.supabase.co/functions/v1/seed-admin \
  -H "Authorization: Bearer your-anon-key"
```

Or use the Supabase dashboard:
1. Go to **Edge Functions** → **seed-admin**
2. Click **Invoke** button

## Step 9: Verify the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Try signing up a new user
   - Try signing in
   - Check if data is being saved correctly

3. Check the browser console for any errors

## Step 10: Update Production Environment Variables

If you have a production deployment (e.g., Vercel, Netlify), update the environment variables there:

1. Go to your hosting platform's dashboard
2. Navigate to **Environment Variables** or **Settings**
3. Update:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

## Troubleshooting

### Issue: "Invalid API key" errors
- **Solution**: Double-check that your `.env` file has the correct keys and restart your dev server

### Issue: Edge Functions not working
- **Solution**: Verify that the environment variables are set correctly in Supabase dashboard under Edge Functions settings

### Issue: Database tables missing
- **Solution**: Make sure you've run the migrations (Step 6)

### Issue: Authentication not working
- **Solution**: 
  - Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct
  - Verify Auth settings in Supabase dashboard (Settings → Auth)
  - Check that email confirmation is set up correctly if required

## Files That Need Updating Summary

1. ✅ `.env` - Environment variables (create if doesn't exist)
2. ✅ `supabase/config.toml` - Project ID
3. ✅ Supabase Dashboard - Edge Function secrets
4. ✅ Production hosting platform - Environment variables

## Important Notes

- **Never commit** your `.env` file or service role keys to git
- The **service role key** has admin access - keep it secret
- The **anon key** is safe to use in frontend code
- After switching projects, users will need to sign up again (unless you migrate user data)

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
