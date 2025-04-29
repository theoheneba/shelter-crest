import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  calculateInitialPayment, 
  formatCurrency, 
  calculateDocumentReviewFee,
  calculateDepositAndInterest
} from '../../utils/paymentCalculations';
import { useConditionalEligibility } from '../../hooks/useConditionalEligibility';
import { useUserStore } from '../../store/userStore';
import { toast } from 'react-hot-toast';
import PaymentModal from '../../components/payment/PaymentModal';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isEligible, isLoading, redirectToEligibilityCheck } = useConditionalEligibility();
  const { createApplication, applications, fetchApplications, loading } = useUserStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'document_review' | 'deposit_interest'>('document_review');
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    monthlyRent: '',
    depositAmount: '',
    interestAmount: '',
    serviceFee: '',
    visitFee: '',
    processingFee: '',
    totalInitialPayment: '',
    landlordName: '',
    landlordEmail: '',
    landlordPhone: '',
    propertyAddress: '',
    leaseStartDate: '',
    leaseEndDate: '',
    landlordPaymentDate: ''
  });

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    // If user already has an application, populate the form with that data
    if (applications.length > 0) {
      const latestApplication = applications[0];
      setFormData({
        monthlyRent: latestApplication.monthly_rent.toString(),
        depositAmount: latestApplication.deposit_amount.toString(),
        interestAmount: latestApplication.interest_amount.toString(),
        serviceFee: latestApplication.service_fee?.toString() || '',
        visitFee: latestApplication.visit_fee?.toString() || '',
        processingFee: latestApplication.processing_fee?.toString() || '',
        totalInitialPayment: latestApplication.total_initial_payment.toString(),
        landlordName: latestApplication.landlord_name,
        landlordEmail: latestApplication.landlord_email,
        landlordPhone: latestApplication.landlord_phone,
        propertyAddress: latestApplication.property_address,
        leaseStartDate: latestApplication.lease_start_date,
        leaseEndDate: latestApplication.lease_end_date,
        landlordPaymentDate: latestApplication.landlord_payment_date || ''
      });
      setApplicationId(latestApplication.id);
    }
  }, [applications]);

  useEffect(() => {
    if (!isLoading && !isEligible) {
      redirectToEligibilityCheck();
    }
  }, [isEligible, isLoading, redirectToEligibilityCheck]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isEligible) {
    return null; // Component will redirect in useEffect
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Calculate all fees when monthly rent changes
      if (name === 'monthlyRent' && value) {
        const monthlyRent = parseFloat(value);
        const { refundableRentSecurity, interest, serviceFee, propertyInspectionFee, documentUploadFee, total } = calculateInitialPayment(monthlyRent);
        return {
          ...newData,
          depositAmount: refundableRentSecurity.toString(),
          interestAmount: interest.toString(),
          serviceFee: serviceFee.toString(),
          visitFee: propertyInspectionFee.toString(),
          processingFee: documentUploadFee.toString(),
          totalInitialPayment: total.toString()
        };
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      const requiredFields = [
        'monthlyRent',
        'landlordName',
        'landlordEmail',
        'landlordPhone',
        'propertyAddress',
        'leaseStartDate',
        'leaseEndDate',
        'landlordPaymentDate'
      ];

      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Calculate document review fee
      const monthlyRent = parseFloat(formData.monthlyRent);
      const documentReviewFee = calculateDocumentReviewFee(monthlyRent);
      
      // Show payment modal for document review fee
      setPaymentStep('document_review');
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
    try {
      const monthlyRent = parseFloat(formData.monthlyRent);
      
      if (paymentStep === 'document_review') {
        // Process document review fee payment
        await paymentService.verifyPayment({
          reference,
          amount: calculateDocumentReviewFee(monthlyRent).total,
          applicationId: 'document_review_fee'
        });
        
        // Create application in pending status
        const response = await createApplication({
          monthly_rent: monthlyRent,
          deposit_amount: parseFloat(formData.depositAmount),
          interest_amount: parseFloat(formData.interestAmount),
          service_fee: parseFloat(formData.serviceFee),
          visit_fee: parseFloat(formData.visitFee),
          processing_fee: parseFloat(formData.processingFee),
          total_initial_payment: parseFloat(formData.totalInitialPayment),
          landlord_name: formData.landlordName,
          landlord_email: formData.landlordEmail,
          landlord_phone: formData.landlordPhone,
          property_address: formData.propertyAddress,
          lease_start_date: formData.leaseStartDate,
          lease_end_date: formData.leaseEndDate,
          landlord_payment_date: formData.landlordPaymentDate,
          prorated_rent: 0, // Will be calculated after approval
          status: 'pending'
        });
        
        setApplicationId(response.id);
        toast.success('Document upload fee paid successfully. Your application is now pending review.');
        navigate('/dashboard');
      } else if (paymentStep === 'deposit_interest') {
        // Calculate prorated rent if landlord payment date is after 15th
        const landlordPaymentDate = new Date(formData.landlordPaymentDate);
        const dayOfMonth = landlordPaymentDate.getDate();
        
        let proratedRent = 0;
        if (dayOfMonth >= 15) {
          // Calculate days remaining in the month
          const daysInMonth = new Date(
            landlordPaymentDate.getFullYear(),
            landlordPaymentDate.getMonth() + 1,
            0
          ).getDate();
          
          const daysRemaining = daysInMonth - dayOfMonth + 1;
          const dailyRent = monthlyRent / daysInMonth;
          proratedRent = dailyRent * daysRemaining;
        }
        
        // Process deposit and interest payment
        const depositAndInterest = calculateDepositAndInterest(monthlyRent);
        const totalPayment = depositAndInterest.total + proratedRent;
        
        await paymentService.verifyPayment({
          reference,
          amount: totalPayment,
          applicationId: applicationId || ''
        });
        
        // Update application status to approved
        if (applicationId) {
          await useUserStore.getState().updateApplication(applicationId, {
            status: 'approved',
            prorated_rent: proratedRent
          });
        }
        
        toast.success('Payment successful! Your application has been approved.');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Payment or application submission error:', error);
      toast.error('Failed to process payment. Please try again.');
    }
  };

  const monthlyRent = formData.monthlyRent ? parseFloat(formData.monthlyRent) : 0;
  const initialPayment = calculateInitialPayment(monthlyRent);
  const documentReviewFee = calculateDocumentReviewFee(monthlyRent);
  const depositAndInterest = calculateDepositAndInterest(monthlyRent);
  
  // Calculate prorated rent if applicable
  const landlordPaymentDate = formData.landlordPaymentDate ? new Date(formData.landlordPaymentDate) : null;
  let proratedRent = 0;
  
  if (landlordPaymentDate) {
    const dayOfMonth = landlordPaymentDate.getDate();
    if (dayOfMonth >= 15) {
      const daysInMonth = new Date(
        landlordPaymentDate.getFullYear(),
        landlordPaymentDate.getMonth() + 1,
        0
      ).getDate();
      
      const daysRemaining = daysInMonth - dayOfMonth + 1;
      const dailyRent = monthlyRent / daysInMonth;
      proratedRent = dailyRent * daysRemaining;
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rent Assistance Application</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent Amount (GH₵)
                  </label>
                  <input
                    type="number"
                    id="monthlyRent"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="landlordPaymentDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Landlord Payment Date
                  </label>
                  <input
                    type="date"
                    id="landlordPaymentDate"
                    name="landlordPaymentDate"
                    value={formData.landlordPaymentDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Date when ShelterCrest will pay your landlord
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="leaseStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Lease Start Date
                  </label>
                  <input
                    type="date"
                    id="leaseStartDate"
                    name="leaseStartDate"
                    value={formData.leaseStartDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="leaseEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Lease End Date
                  </label>
                  <input
                    type="date"
                    id="leaseEndDate"
                    name="leaseEndDate"
                    value={formData.leaseEndDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Address
                </label>
                <input
                  type="text"
                  id="propertyAddress"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="landlordName" className="block text-sm font-medium text-gray-700 mb-1">
                    Landlord Name
                  </label>
                  <input
                    type="text"
                    id="landlordName"
                    name="landlordName"
                    value={formData.landlordName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="landlordEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Landlord Email
                  </label>
                  <input
                    type="email"
                    id="landlordEmail"
                    name="landlordEmail"
                    value={formData.landlordEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="landlordPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Landlord Phone
                  </label>
                  <input
                    type="tel"
                    id="landlordPhone"
                    name="landlordPhone"
                    value={formData.landlordPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                isLoading={loading}
              >
                {applications.length > 0 ? "Update Application" : "Submit Application"}
              </Button>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
              
              <div className="space-y-4">
                {/* Document Upload Fee */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 border-b pb-2 mb-3">Step 1: Document Upload Fee</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span>Service Fee:</span>
                      <span>{formatCurrency(documentReviewFee.serviceFee)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Document Upload Fee:</span>
                      <span>{formatCurrency(documentReviewFee.documentUploadFee)}</span>
                    </p>
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <p className="flex justify-between font-semibold">
                        <span>Total Document Upload Fee:</span>
                        <span>{formatCurrency(documentReviewFee.total)}</span>
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-blue-600">
                    This fee is required before your documents are reviewed.
                  </p>
                </div>
                
                {/* Refundable Rent Security and Interest */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 border-b pb-2 mb-3">Step 2: After Approval</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span>Refundable Rent Security:</span>
                      <span>{formatCurrency(depositAndInterest.refundableRentSecurity)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Interest (2.33% on monthly rent for 2 months):</span>
                      <span>{formatCurrency(depositAndInterest.interest)}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Property Inspection Fee:</span>
                      <span>{formatCurrency(depositAndInterest.propertyInspectionFee)}</span>
                    </p>
                    
                    {proratedRent > 0 && (
                      <p className="flex justify-between text-primary-700 font-medium">
                        <span>Prorated Rent:</span>
                        <span>{formatCurrency(proratedRent)}</span>
                      </p>
                    )}
                    
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <p className="flex justify-between font-semibold">
                        <span>Total After Approval:</span>
                        <span>{formatCurrency(depositAndInterest.total + proratedRent)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Important Notes</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Monthly payments due: 25th - 5th (grace period)</li>
                    <li>• Late payment fees:
                      <ul className="ml-4 mt-1">
                        <li>- 6th-12th: 10% penalty</li>
                        <li>- 13th-18th: 15% penalty</li>
                        <li>- 19th-24th: 25% penalty</li>
                      </ul>
                    </li>
                    <li>• Refundable rent security returned after completing all payments</li>
                    
                    {proratedRent > 0 && (
                      <li className="text-primary-700 font-medium">
                        • First payment will be on the 25th of next month
                      </li>
                    )}
                    {proratedRent === 0 && landlordPaymentDate && (
                      <li className="text-primary-700 font-medium">
                        • First payment will be on the 25th of this month
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-700 mb-2">Contact Information</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Office Address: Nii Laryea Odumanye RD</li>
                    <li>• Contact: 0204090400 / 0204090411</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={paymentStep === 'document_review' 
          ? documentReviewFee.total 
          : depositAndInterest.total + proratedRent}
        dueDate={new Date().toISOString()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default ApplicationForm;