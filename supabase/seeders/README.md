# Database Seeders

This directory contains seeder scripts to partially create admin accounts and other database records.

## Admin Account Seeder

The admin seeder creates/updates the following for an existing auth user:
- Profile record in `profiles` table
- Admin role in `user_roles` table  
- Student progress record in `student_progress` table

**Note:** This seeder assumes the auth user already exists in `auth.users`. It does NOT create the auth user itself.

### Option 1: SQL Seeder (`seed-admin.sql`)

Run directly in Supabase SQL Editor or via CLI:

```bash
# Using Supabase CLI
supabase db execute -f supabase/seeders/seed-admin.sql

# Or copy-paste into Supabase Dashboard → SQL Editor
```

**Before running, edit the file and:**
1. Change `admin_email` variable to your admin's email
2. Or uncomment Option 2/3 and provide the user ID

### Option 2: TypeScript Seeder (`seed-admin.ts`)

More flexible script that can find users by email or user ID.

#### Prerequisites

Install TypeScript execution tool:
```bash
npm install -D tsx
# or
npx tsx supabase/seeders/seed-admin.ts
```

#### Setup Environment Variables

Create a `.env.local` file (or set in your environment):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Usage

**1. Seed admin by email:**
```bash
npm run seed:admin -- --email admin@example.com
```

**2. Seed admin by user ID:**
```bash
npm run seed:admin -- --user-id <uuid-here>
```

**3. Promote first user to admin:**
```bash
npm run seed:admin -- --first-user
```

**4. Auto-detect (promotes first user if no admin exists):**
```bash
npm run seed:admin
```

#### Example Workflow

1. **Create a user via Supabase Auth:**
   - Go to Supabase Dashboard → Authentication → Users
   - Create a new user or use an existing one
   - Note the email or user ID

2. **Run the seeder:**
   ```bash
   npm run seed:admin -- --email your-admin@example.com
   ```

3. **Verify:**
   - Check `user_roles` table - should have role = 'admin'
   - Check `profiles` table - should have the user's profile
   - User can now log in and access admin dashboard

## What Gets Created

The seeder creates/updates:

1. **Profile** (`profiles` table):
   - `user_id`: Links to auth user
   - `full_name`: "System Administrator" (or from user metadata)
   - `email`: User's email

2. **Role** (`user_roles` table):
   - `user_id`: Links to auth user
   - `role`: 'admin'

3. **Progress** (`student_progress` table):
   - `user_id`: Links to auth user
   - Initialized with default values

## Troubleshooting

### "User not found"
- Make sure the user exists in `auth.users` table
- Check the email/user ID is correct
- Create the user first via Supabase Auth dashboard

### "Permission denied"
- Ensure you're using the `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Service role key has admin privileges

### "Admin already exists"
- The seeder checks if an admin exists and skips if found
- To force update, manually delete the admin role first

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` or service role keys to git
- Service role key has full database access - keep it secret
- Change default passwords after first login
- Review admin access regularly
