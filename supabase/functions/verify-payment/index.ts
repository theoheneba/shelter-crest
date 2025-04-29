import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();
    
    if (!reference) {
      return new Response(
        JSON.stringify({ success: false, message: 'Reference is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Paystack verification endpoint
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY') || 'sk_live_f2•••••01c';
    const verificationUrl = `https://api.paystack.co/transaction/verify/${reference}`;

    const response = await fetch(verificationUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: errorData.message || 'Payment verification failed' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Check if the payment was successful
    if (data.data.status !== 'success') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment was not successful',
          status: data.data.status
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified successfully',
        data: {
          amount: data.data.amount / 100, // Convert from kobo to GHS
          reference: data.data.reference,
          status: data.data.status,
          paidAt: data.data.paid_at,
          channel: data.data.channel,
          currency: data.data.currency
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});