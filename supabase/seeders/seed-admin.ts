/**
 * Seeder script to partially create an admin account
 * 
 * This script assumes the auth user already exists and only creates/updates:
 * - Profile record
 * - Admin role
 * - Student progress record
 * 
 * Usage:
 * 1. Set environment variables:
 *    - SUPABASE_URL
 *    - SUPABASE_SERVICE_ROLE_KEY
 * 
 * 2. Run: npx tsx supabase/seeders/seed-admin.ts
 * 
 * Or use with environment file:
 * npx dotenv -e .env.local -- npx tsx supabase/seeders/seed-admin.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface SeedOptions {
  email?: string;
  userId?: string;
  promoteFirstUser?: boolean;
}

async function seedAdmin(options: SeedOptions = {}) {
  try {
    let targetUserId: string | null = null;

    // Option 1: Find user by email
    if (options.email) {
      console.log(`🔍 Looking for user with email: ${options.email}`);
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      const user = users?.find(u => u.email === options.email);
      if (user) {
        targetUserId = user.id;
        console.log(`✓ Found user: ${user.id}`);
      } else {
        console.error(`❌ User with email ${options.email} not found`);
        console.log('💡 Please create the user first via Supabase Auth dashboard or sign up');
        return;
      }
    }
    // Option 2: Use provided user ID
    else if (options.userId) {
      targetUserId = options.userId;
      console.log(`🔍 Using provided user ID: ${targetUserId}`);
    }
    // Option 3: Promote first user
    else if (options.promoteFirstUser) {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      
      if (users && users.length > 0) {
        // Sort by created_at and get the first one
        const sortedUsers = users.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        targetUserId = sortedUsers[0].id;
        console.log(`✓ Promoting first user to admin: ${sortedUsers[0].email} (${targetUserId})`);
      } else {
        console.error('❌ No users found in the system');
        return;
      }
    }
    // Default: Check if admin exists, if not, use first user
    else {
      // Check if admin already exists
      const { data: existingAdmins } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin')
        .limit(1);

      if (existingAdmins && existingAdmins.length > 0) {
        console.log('ℹ️  Admin already exists, skipping seed');
        return;
      }

      // Promote first user
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      
      if (users && users.length > 0) {
        const sortedUsers = users.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        targetUserId = sortedUsers[0].id;
        console.log(`✓ No admin found, promoting first user: ${sortedUsers[0].email}`);
      } else {
        console.error('❌ No users found. Please create a user first.');
        return;
      }
    }

    if (!targetUserId) {
      console.error('❌ Could not determine target user ID');
      return;
    }

    // Get user info
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(targetUserId);
    if (userError) throw userError;

    console.log(`\n📝 Creating/updating admin account for: ${user?.email}`);

    // 1. Create or update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: targetUserId,
        full_name: user?.user_metadata?.full_name || 'System Administrator',
        email: user?.email || '',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (profileError) {
      console.error('❌ Error updating profile:', profileError);
      throw profileError;
    }
    console.log('✓ Profile created/updated');

    // 2. Create or update admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: targetUserId,
        role: 'admin'
      }, {
        onConflict: 'user_id,role'
      });

    if (roleError) {
      console.error('❌ Error updating role:', roleError);
      throw roleError;
    }
    console.log('✓ Admin role assigned');

    // 3. Ensure student_progress exists (required by schema)
    const { error: progressError } = await supabase
      .from('student_progress')
      .upsert({
        user_id: targetUserId
      }, {
        onConflict: 'user_id'
      });

    if (progressError && !progressError.message.includes('duplicate')) {
      console.warn('⚠️  Warning creating progress record:', progressError);
    } else {
      console.log('✓ Progress record ensured');
    }

    console.log('\n✅ Admin account created successfully!');
    console.log(`   Email: ${user?.email}`);
    console.log(`   User ID: ${targetUserId}`);
    console.log('\n💡 The user can now log in and access the admin dashboard');

  } catch (error) {
    console.error('\n❌ Error seeding admin:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: SeedOptions = {};

if (args.includes('--email')) {
  const emailIndex = args.indexOf('--email');
  options.email = args[emailIndex + 1];
} else if (args.includes('--user-id')) {
  const userIdIndex = args.indexOf('--user-id');
  options.userId = args[userIdIndex + 1];
} else if (args.includes('--first-user')) {
  options.promoteFirstUser = true;
}

// Run the seeder
seedAdmin(options);
