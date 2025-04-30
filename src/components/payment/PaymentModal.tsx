import { useState } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';
import PaystackButton from './PaystackButton';
import { formatCurrency } from '../../utils/paymentCalculations';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  dueDate: string;
  onPaymentSuccess: (reference: string) => void;
}

const PaymentModal = ({ isOpen, onClose, amount, dueDate, onPaymentSuccess }: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSuccess = async (reference: string) => {
    try {
      setIsProcessing(true);
      setError(null);
      await onPaymentSuccess(reference);
      onClose();
    } catch (err) {
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Make Payment</h2>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount Due:</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Due Date:</span>
                <span className="text-gray-900">{new Date(dueDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-400" />
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Payment is processed securely through Paystack. Your payment information is never stored on our servers.
                  </p>
                </div>
              </div>
            </div>

            {isProcessing ? (
              <div className="flex items-center justify-center p-4">
                <Loader className="h-8 w-8 text-primary-500 animate-spin" />
                <span className="ml-3 text-gray-600">Processing payment...</span>
              </div>
            ) : (
              <PaystackButton
                amount={amount}
                onSuccess={handleSuccess}
                onClose={handleClose}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;