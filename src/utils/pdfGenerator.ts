import { jsPDF } from 'jspdf';

export const generateAgreementPdf = async (signature: string, applicationData: any) => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Rental Assistance Agreement', 20, 20);
  
  // Add content
  doc.setFontSize(12);
  doc.text('This agreement is made between ShelterCrest ("the Company") and', 20, 40);
  doc.text(`${applicationData.firstName} ${applicationData.lastName} ("the Tenant").`, 20, 50);
  
  // Add agreement details
  doc.text('1. Assistance Details', 20, 70);
  doc.text(`Monthly Rent Amount: GH₵ ${applicationData.monthlyRent}`, 30, 80);
  doc.text(`Deposit Amount: GH₵ ${applicationData.depositAmount}`, 30, 90);
  doc.text(`Lease Period: ${new Date(applicationData.leaseStartDate).toLocaleDateString()} to`, 30, 100);
  doc.text(new Date(applicationData.leaseEndDate).toLocaleDateString(), 30, 110);
  
  // Add signature
  doc.addImage(signature, 'PNG', 20, 200, 50, 30);
  doc.text('Tenant Signature', 20, 240);
  
  // Add date
  const date = new Date().toLocaleDateString();
  doc.text(`Date: ${date}`, 20, 250);
  
  return doc.output('datauristring');
};