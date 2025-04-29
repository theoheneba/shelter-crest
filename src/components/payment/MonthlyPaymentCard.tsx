import { useState, useEffect } from 'react';
import { Calendar, DollarSign, Clock, AlertCircle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency, calculateLatePaymentFee } from '../../utils/paymentCalculations';
import PaymentModal from './PaymentModal';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

interface MonthlyPaymentCardProps {
  applicationId: string;
  monthlyAmount: number;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingPayments: number;
  totalPayments: number;
  onPaymentComplete?: () => void;
}

const MonthlyPaymentCard = ({
  applicationId,
  monthlyAmount,
  dueDate,
  totalAmount,
  paidAmount,
  remainingPayments,
  totalPayments,
  onPaymentComplete
}: MonthlyPaymentCardProps) => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [lateFee, setLateFee] = useState(0);
  const [daysUntilDue, setDaysUntilDue] = useState(0);
  const [isLate, setIsLate] = useState(false);
  
  useEffect(() => {
    const today = new Date();
    const due = new Date(dueDate);
    
    // Calculate days until due
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysUntilDue(diffDays);
    
    // Check if payment is late
    const currentDay = today.getDate();
    const isLatePayment = diffDays < 0;
    setIsLate(isLatePayment);
    
    // Calculate late fee if applicable
    if (isLatePayment) {
      const fee = calculateLatePaymentFee(monthlyAmount, currentDay);
      setLateFee(fee);
    } else {
      setLateFee(0);
    }
  }, [dueDate, monthlyAmount]);
  
  const handlePaymentSuccess = async (reference: string) => {
    try {
      await paymentService.verifyPayment({
        reference,
        amount: monthlyAmount + lateFee,
        userId: user?.id || '',
        applicationId
      });
      
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  };
  
  const progressPercentage = (paidAmount / totalAmount) * 100;
  const paymentProgress = `${totalPayments - remainingPayments}/${totalPayments}`;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-full mr-3">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Payment Due</p>
              <p className="font-medium">{new Date(dueDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-xl font-bold text-primary-700">{formatCurrency(monthlyAmount)}</p>
            {lateFee > 0 && (
              <p className="text-sm text-red-500">
                + {formatCurrency(lateFee)} late fee
              </p>
            )}
          </div>
        </div>
        
        {isLate ? (
          <div className="bg-red-50 p-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Payment Overdue</p>
              <p className="text-xs text-red-700">
                Your payment is {Math.abs(daysUntilDue)} days late. A {lateFee > 0 ? formatCurrency(lateFee) : '0%'} late fee has been applied.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 p-3 rounded-lg flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                {daysUntilDue > 0 ? `${daysUntilDue} days until payment due` : 'Payment due today'}
              </p>
              <p className="text-xs text-blue-700">
                Payment window: 25th to 5th of each month
              </p>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Progress</span>
            <span className="font-medium">{paymentProgress} payments</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatCurrency(paidAmount)} paid</span>
            <span>{formatCurrency(totalAmount - paidAmount)} remaining</span>
          </div>
        </div>
        
        <div className="pt-2">
          <Button
            fullWidth
            leftIcon={<DollarSign size={16} />}
            onClick={() => setShowPaymentModal(true)}
          >
            Make Payment
          </Button>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        <div className="w-full text-sm text-gray-500">
          <div className="flex justify-between mb-1">
            <span>Total Loan Amount:</span>
            <span className="font-medium text-gray-700">{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Remaining Balance:</span>
            <span className="font-medium text-gray-700">{formatCurrency(totalAmount - paidAmount)}</span>
          </div>
        </div>
      </CardFooter>
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={monthlyAmount + lateFee}
        dueDate={dueDate}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Card>
  );
};

export default MonthlyPaymentCard;