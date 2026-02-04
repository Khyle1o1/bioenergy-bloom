import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Check if any admin already exists
    const { data: existingAdmins, error: checkError } = await supabaseAdmin
      .from('user_roles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (checkError) {
      throw checkError
    }

    // If admin exists, skip seeding
    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ 
          message: 'Admin already exists, skipping seed',
          seeded: false 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create default admin account
    const defaultAdminEmail = 'admin@suncellbuddy.edu'
    const defaultAdminPassword = 'Admin@2024!'
    const defaultAdminName = 'System Administrator'

    const { data: newAdmin, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: defaultAdminEmail,
      password: defaultAdminPassword,
      email_confirm: true,
      user_metadata: { full_name: defaultAdminName }
    })

    if (createError) {
      // If user already exists with this email, just set them as admin
      if (createError.message.includes('already exists')) {
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = authUsers?.users.find(u => u.email === defaultAdminEmail)
        
        if (existingUser) {
          // Update their role to admin
          await supabaseAdmin
            .from('user_roles')
            .upsert({ user_id: existingUser.id, role: 'admin' }, { onConflict: 'user_id' })

          return new Response(
            JSON.stringify({ 
              message: 'Existing user promoted to admin',
              seeded: true,
              email: defaultAdminEmail
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
      throw createError
    }

    // Update the role to admin (trigger creates as student by default)
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', newAdmin.user.id)

    if (roleError) {
      // If no row exists, insert it
      await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: newAdmin.user.id, role: 'admin' })
    }

    return new Response(
      JSON.stringify({ 
        message: 'Default admin account created successfully',
        seeded: true,
        email: defaultAdminEmail,
        note: 'Please change the password after first login'
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Seed admin error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
