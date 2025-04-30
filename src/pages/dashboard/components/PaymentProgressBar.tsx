import { motion } from 'framer-motion';
import { formatCurrency } from '../../../utils/paymentCalculations';

interface PaymentProgressBarProps {
  totalAmount: number;
  paidAmount: number;
  currentPayment: number;
  totalPayments: number;
}

const PaymentProgressBar = ({
  totalAmount,
  paidAmount,
  currentPayment,
  totalPayments
}: PaymentProgressBarProps) => {
  const progressPercentage = (paidAmount / totalAmount) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Payment Progress</span>
        <span className="font-medium">{currentPayment}/{totalPayments} payments</span>
      </div>
      
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-0 left-0 h-full bg-primary-600 rounded-full"
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatCurrency(paidAmount)} paid</span>
        <span>{formatCurrency(totalAmount - paidAmount)} remaining</span>
      </div>
      
      <div className="flex justify-center mt-2">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary-600"></div>
          <span className="text-xs text-gray-600">{Math.round(progressPercentage)}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentProgressBar;