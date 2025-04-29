import { Calendar, Clock, AlertCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { formatCurrency, calculateLatePaymentFee } from '../../../utils/paymentCalculations';

interface UpcomingPaymentCardProps {
  amount: number;
  dueDate: string;
  onMakePayment: () => void;
}

const UpcomingPaymentCard = ({ amount, dueDate, onMakePayment }: UpcomingPaymentCardProps) => {
  const today = new Date();
  const due = new Date(dueDate);
  
  // Calculate days until due
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Check if payment is late
  const isLate = diffDays < 0;
  
  // Calculate late fee if applicable
  const currentDay = today.getDate();
  const lateFee = isLate ? calculateLatePaymentFee(amount, currentDay) : 0;
  
  // Determine status and message
  let statusColor = 'bg-blue-50 text-blue-800';
  let statusIcon = <Clock className="h-5 w-5 text-blue-500" />;
  let statusMessage = `Due in ${diffDays} days`;
  
  if (diffDays === 0) {
    statusMessage = 'Due today';
  } else if (isLate) {
    statusColor = 'bg-red-50 text-red-800';
    statusIcon = <AlertCircle className="h-5 w-5 text-red-500" />;
    statusMessage = `${Math.abs(diffDays)} days overdue`;
  }
  
  return (
    <div className={`p-4 rounded-lg ${statusColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-inherit" />
          <h3 className="font-medium">Upcoming Payment</h3>
        </div>
        <div className="flex items-center">
          {statusIcon}
          <span className="ml-1 text-sm">{statusMessage}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-sm opacity-80">Amount Due</p>
          <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
          {lateFee > 0 && (
            <p className="text-sm text-red-600">+ {formatCurrency(lateFee)} late fee</p>
          )}
        </div>
        <div>
          <p className="text-sm opacity-80">Due Date</p>
          <p className="text-base font-medium">{due.toLocaleDateString()}</p>
        </div>
      </div>
      
      <Button
        fullWidth
        onClick={onMakePayment}
      >
        Make Payment
      </Button>
    </div>
  );
};

export default UpcomingPaymentCard;