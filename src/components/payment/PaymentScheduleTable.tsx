import { useState } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/paymentCalculations';

interface PaymentScheduleItem {
  paymentNumber: number;
  paymentDate: Date;
  paymentAmount: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  status?: 'paid' | 'pending' | 'late';
  discount?: number;
  discountReason?: string;
  bonus?: number;
  bonusReason?: string;
}

interface PaymentScheduleTableProps {
  schedule: PaymentScheduleItem[];
  currentPaymentNumber: number;
}

const PaymentScheduleTable = ({ schedule, currentPaymentNumber }: PaymentScheduleTableProps) => {
  const [visibleItems, setVisibleItems] = useState(5);
  
  const getStatusIcon = (status: string | undefined, paymentNumber: number) => {
    if (status === 'paid' || paymentNumber < currentPaymentNumber) {
      return <Check size={16} className="text-green-500" />;
    } else if (status === 'late' || (paymentNumber === currentPaymentNumber && new Date() > new Date(schedule[paymentNumber - 1].paymentDate))) {
      return <AlertCircle size={16} className="text-red-500" />;
    } else {
      return <Clock size={16} className="text-blue-500" />;
    }
  };
  
  const getStatusClass = (status: string | undefined, paymentNumber: number) => {
    if (status === 'paid' || paymentNumber < currentPaymentNumber) {
      return 'bg-green-100 text-green-800';
    } else if (status === 'late' || (paymentNumber === currentPaymentNumber && new Date() > new Date(schedule[paymentNumber - 1].paymentDate))) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };
  
  const getStatusText = (status: string | undefined, paymentNumber: number) => {
    if (status === 'paid' || paymentNumber < currentPaymentNumber) {
      return 'Paid';
    } else if (status === 'late' || (paymentNumber === currentPaymentNumber && new Date() > new Date(schedule[paymentNumber - 1].paymentDate))) {
      return 'Late';
    } else if (paymentNumber === currentPaymentNumber) {
      return 'Current';
    } else {
      return 'Upcoming';
    }
  };
  
  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + 5, schedule.length));
  };
  
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount/Bonus</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedule.slice(0, visibleItems).map((payment) => (
              <tr key={payment.paymentNumber} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {payment.paymentNumber}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {payment.paymentDate.toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payment.paymentAmount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(payment.principalPayment)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(payment.interestPayment)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {(payment.discount || payment.bonus) ? (
                    <div>
                      {payment.discount && (
                        <div className="text-green-600">
                          -{formatCurrency(payment.discount)}
                          {payment.discountReason && <div className="text-xs">{payment.discountReason}</div>}
                        </div>
                      )}
                      {payment.bonus && (
                        <div className="text-blue-600">
                          -{formatCurrency(payment.bonus)}
                          {payment.bonusReason && <div className="text-xs">{payment.bonusReason}</div>}
                        </div>
                      )}
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payment.remainingBalance)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(payment.status, payment.paymentNumber)}`}>
                    {getStatusIcon(payment.status, payment.paymentNumber)}
                    <span className="ml-1">{getStatusText(payment.status, payment.paymentNumber)}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {visibleItems < schedule.length && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentScheduleTable;