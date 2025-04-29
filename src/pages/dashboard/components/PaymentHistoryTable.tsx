import { Check, AlertCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../../../utils/paymentCalculations';

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

interface PaymentHistoryTableProps {
  payments: Payment[];
}

const PaymentHistoryTable = ({ payments }: PaymentHistoryTableProps) => {
  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'Completed':
        return <Check size={16} className="text-green-500" />;
      case 'Pending':
        return <Clock size={16} className="text-orange-500" />;
      case 'Failed':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: Payment['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No payment records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {new Date(payment.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                {formatCurrency(payment.amount)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                  <span className="ml-1">{payment.status}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistoryTable;