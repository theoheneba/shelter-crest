import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyEmailPayload {
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

    // Initialize Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the email from the request body
    const { email }: VerifyEmailPayload = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    // Get the user by email
    const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers({
      filter: {
        email: email
      }
    });

    if (getUserError) throw getUserError;
    if (!users || users.length === 0) {
      throw new Error("User not found");
    }

    const user = users[0];

    // Verify the user's email
    const { error: verifyError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (verifyError) throw verifyError;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email verified successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
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