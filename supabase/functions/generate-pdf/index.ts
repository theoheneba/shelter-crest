import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import * as pdfLib from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { signature, applicationData } = await req.json();
    
    if (!signature || !applicationData) {
      return new Response(
        JSON.stringify({ success: false, message: 'Signature and application data are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create PDF document
    const pdfDoc = await pdfLib.PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Add header
    const { width, height } = page.getSize();
    const fontSize = 24;
    page.drawText('Rental Assistance Agreement', {
      x: 50,
      y: height - 50,
      size: fontSize,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    // Add content
    page.drawText('This agreement is made between ShelterCrest ("the Company") and', {
      x: 50,
      y: height - 100,
      size: 12,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    page.drawText(`${applicationData.firstName} ${applicationData.lastName} ("the Tenant").`, {
      x: 50,
      y: height - 120,
      size: 12,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    // Add agreement details
    page.drawText('1. Assistance Details', {
      x: 50,
      y: height - 160,
      size: 14,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    page.drawText(`Monthly Rent Amount: GH₵ ${applicationData.monthlyRent}`, {
      x: 70,
      y: height - 180,
      size: 12,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    page.drawText(`Deposit Amount: GH₵ ${applicationData.depositAmount}`, {
      x: 70,
      y: height - 200,
      size: 12,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    page.drawText(`Lease Period: ${new Date(applicationData.leaseStartDate).toLocaleDateString()} to`, {
      x: 70,
      y: height - 220,
      size: 12,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    page.drawText(`${new Date(applicationData.leaseEndDate).toLocaleDateString()}`, {
      x: 70,
      y: height - 240,
      size: 12,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    // Add signature
    // Convert base64 signature to image
    const signatureImage = await pdfDoc.embedPng(signature);
    page.drawImage(signatureImage, {
      x: 50,
      y: height - 400,
      width: 150,
      height: 50,
    });
    
    page.drawText('Tenant Signature', {
      x: 50,
      y: height - 420,
      size: 12,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    // Add date
    const date = new Date().toLocaleDateString();
    page.drawText(`Date: ${date}`, {
      x: 50,
      y: height - 450,
      size: 12,
      color: pdfLib.rgb(0, 0, 0),
    });
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    return new Response(
      pdfBytes,
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="agreement.pdf"'
        },
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