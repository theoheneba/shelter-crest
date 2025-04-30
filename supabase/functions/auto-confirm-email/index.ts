import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailConfirmPayload {
  email: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables");
    }

    // Initialize Supabase admin client with proper configuration
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public'
      }
    });

    // Get the email from the request body
    const { email }: EmailConfirmPayload = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Get the user by email with error handling
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
      filter: {
        email: email
      }
    });

    if (getUserError) {
      console.error('Error getting user:', getUserError);
      throw new Error(`Failed to get user: ${getUserError.message}`);
    }

    if (!users || users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];

    // Update the user to confirm their email
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          ...user.user_metadata,
          email_confirmed: true
        }
      }
    );

    if (updateError) {
      console.error('Error updating user:', updateError);
      throw new Error(`Failed to update user: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email confirmed successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});