import { DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/paymentCalculations';

interface PaymentSummaryProps {
  monthlyRent: number;
  depositAmount: number;
  interestAmount: number;
  serviceFee: number;
  propertyInspectionFee: number;
  documentUploadFee: number;
  totalAmount: number;
  proratedRent?: number;
  landlordPaymentDate?: Date;
  isInitialDocumentFee?: boolean;
}

const PaymentSummary = ({
  monthlyRent,
  depositAmount,
  interestAmount,
  serviceFee,
  propertyInspectionFee,
  documentUploadFee,
  totalAmount,
  proratedRent = 0,
  landlordPaymentDate,
  isInitialDocumentFee = false
}: PaymentSummaryProps) => {
  // Determine if we need to show prorated rent info
  const showProration = proratedRent > 0 && landlordPaymentDate;
  const dayOfMonth = landlordPaymentDate ? landlordPaymentDate.getDate() : 0;
  
  return (
    <div className="space-y-4">
      {isInitialDocumentFee ? (
        <div>
          <h3 className="font-medium text-gray-700">Document Review Fee</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Service Fee:</span>
              <span>{formatCurrency(serviceFee)}</span>
            </p>
            <p className="flex justify-between">
              <span>Document Upload Fee:</span>
              <span>{formatCurrency(documentUploadFee)}</span>
            </p>
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              <p className="flex justify-between font-semibold">
                <span>Total Document Review Fee:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-700 mb-2">Important Note</h3>
            <p className="text-sm text-blue-700">
              This fee is required before your documents can be reviewed. After approval, you'll need to pay the refundable rent security, interest, and property inspection fee.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-medium text-gray-700">Initial Payment Required</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p className="flex justify-between">
              <span>Refundable Rent Security:</span>
              <span>{formatCurrency(depositAmount)}</span>
            </p>
            <p className="flex justify-between">
              <span>Interest (2.33% on monthly rent for 2 months):</span>
              <span>{formatCurrency(interestAmount)}</span>
            </p>
            <p className="flex justify-between">
              <span>Property Inspection Fee:</span>
              <span>{formatCurrency(propertyInspectionFee)}</span>
            </p>
            
            {showProration && (
              <p className="flex justify-between text-primary-700 font-medium">
                <span>Prorated Rent (Remaining days):</span>
                <span>{formatCurrency(proratedRent)}</span>
              </p>
            )}
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              <p className="flex justify-between font-semibold">
                <span>Total Initial Payment:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </p>
            </div>
          </div>
        </div>
      )}

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
          
          {showProration && (
            <li className="text-primary-700 font-medium">
              • Since landlord is paid after the 15th (day {dayOfMonth}), your first regular payment will be on the 25th of next month
            </li>
          )}
          
          {!showProration && landlordPaymentDate && (
            <li className="text-primary-700 font-medium">
              • Since landlord is paid before the 15th (day {dayOfMonth}), your first payment will be on the 25th of this month
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
  );
};

export default PaymentSummary;