import { DollarSign, Calendar, Info } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils/paymentCalculations';

interface PaymentSummaryCardProps {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  loanTerm: number;
  interestRate: number;
}

const PaymentSummaryCard = ({
  monthlyPayment,
  totalPayments,
  totalInterest,
  loanTerm,
  interestRate
}: PaymentSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-full mr-3">
              <DollarSign className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-primary-600">Monthly Payment</p>
              <p className="text-xl font-bold text-primary-900">{formatCurrency(monthlyPayment)}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Loan Term</p>
            <p className="text-lg font-semibold text-gray-900">{loanTerm} months</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="text-lg font-semibold text-gray-900">{interestRate}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Interest</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalInterest)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Payments</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalPayments)}</p>
          </div>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">Payment Schedule</p>
              <p className="text-xs text-blue-700 mt-1">
                Your monthly payments are due between the 25th and 5th of each month.
                Late payments will incur additional fees.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummaryCard;