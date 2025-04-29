import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const client = new SmtpClient();

    await client.connectTLS({
      hostname: "smtp.hostinger.com",
      port: 465,
      username: "info@sheltercrest.org",
      password: "@3sheltercrest.orG",
    });

    const { to, subject, html, attachments } = await req.json();

    const result = await client.send({
      from: "info@sheltercrest.org",
      to,
      subject,
      content: html,
      html: true,
      attachments,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true, messageId: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});