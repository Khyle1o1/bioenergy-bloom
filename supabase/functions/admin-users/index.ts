import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function buildCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') ?? '*'
  return {
    // Echo origin so browsers accept preflight reliably
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Max-Age': '86400',
  }
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req)
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Create admin client with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Get the authorization header to verify the caller is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a client with anon key (used only to validate the user's JWT)
    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Get the current user (pass raw JWT explicitly)
    const jwt = authHeader.replace(/^Bearer\s+/i, '').trim()
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message ?? 'Invalid JWT' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if the user is an admin using the service role client
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')

    if (rolesError) {
      console.error('Admin role check failed:', rolesError)
      return new Response(
        JSON.stringify({ error: 'Role check failed', details: rolesError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!roles || roles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    const body = req.method !== 'GET' ? await req.json() : null

    switch (action) {
      case 'list': {
        // Get all users with their profiles and roles
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
        if (authError) throw authError

        const { data: profiles, error: profilesError } = await supabaseAdmin
          .from('profiles')
          .select('*')

        if (profilesError) throw profilesError

        const { data: userRoles, error: rolesErr } = await supabaseAdmin
          .from('user_roles')
          .select('*')

        if (rolesErr) throw rolesErr

        // Combine the data - prioritize admin role if user has multiple roles
        const users = authUsers.users.map(authUser => {
          const profile = profiles?.find(p => p.user_id === authUser.id)
          const userRoleRecords = userRoles?.filter(r => r.user_id === authUser.id) || []
          // If user has admin role, use that, otherwise use first role or default to student
          const hasAdmin = userRoleRecords.some(r => r.role === 'admin')
          const role = hasAdmin ? 'admin' : (userRoleRecords[0]?.role || 'student')
          return {
            id: authUser.id,
            email: authUser.email,
            full_name: profile?.full_name || 'Unknown',
            role: role,
            created_at: authUser.created_at,
            last_sign_in: authUser.last_sign_in_at,
            email_confirmed: authUser.email_confirmed_at != null
          }
        })

        return new Response(
          JSON.stringify({ users }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'create': {
        const { email, password, full_name, role } = body

        if (!email || !password || !full_name) {
          return new Response(
            JSON.stringify({ error: 'Email, password, and full name are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          return new Response(
            JSON.stringify({ error: 'Invalid email format' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Validate password length
        if (password.length < 6) {
          return new Response(
            JSON.stringify({ error: 'Password must be at least 6 characters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create user with Supabase Auth Admin API (password is hashed by Supabase)
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name }
        })

        if (createError) {
          return new Response(
            JSON.stringify({ error: createError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // The trigger should create profile and role, but update role if different
        if (role && role !== 'student') {
          await supabaseAdmin
            .from('user_roles')
            .update({ role })
            .eq('user_id', newUser.user.id)
        }

        return new Response(
          JSON.stringify({ success: true, user: newUser.user }),
          { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update': {
        const { user_id, email, full_name, role, password } = body

        if (!user_id) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Update auth user if email or password changed
        const authUpdates: Record<string, string> = {}
        if (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email)) {
            return new Response(
              JSON.stringify({ error: 'Invalid email format' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
          authUpdates.email = email
        }
        if (password) {
          if (password.length < 6) {
            return new Response(
              JSON.stringify({ error: 'Password must be at least 6 characters' }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
          authUpdates.password = password
        }

        if (Object.keys(authUpdates).length > 0) {
          const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
            user_id,
            authUpdates
          )
          if (authUpdateError) {
            return new Response(
              JSON.stringify({ error: authUpdateError.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        // Update profile
        if (full_name || email) {
          const profileUpdates: Record<string, string> = {}
          if (full_name) profileUpdates.full_name = full_name
          if (email) profileUpdates.email = email

          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update(profileUpdates)
            .eq('user_id', user_id)

          if (profileError) {
            return new Response(
              JSON.stringify({ error: profileError.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        // Update role
        if (role) {
          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .update({ role })
            .eq('user_id', user_id)

          if (roleError) {
            return new Response(
              JSON.stringify({ error: roleError.message }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete': {
        const { user_id } = body

        if (!user_id) {
          return new Response(
            JSON.stringify({ error: 'User ID is required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Prevent admin from deleting themselves
        if (user_id === user.id) {
          return new Response(
            JSON.stringify({ error: 'Cannot delete your own account' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Delete user (cascades to profiles, roles, progress via foreign keys or trigger)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id)

        if (deleteError) {
          return new Response(
            JSON.stringify({ error: deleteError.message }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Also manually clean up related data in case cascade isn't set
        await supabaseAdmin.from('profiles').delete().eq('user_id', user_id)
        await supabaseAdmin.from('user_roles').delete().eq('user_id', user_id)
        await supabaseAdmin.from('student_progress').delete().eq('user_id', user_id)

        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Admin users error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
