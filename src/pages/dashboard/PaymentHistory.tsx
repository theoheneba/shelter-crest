import { useState, useEffect } from 'react';
import { Calendar, Download, Filter, Search, CreditCard, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import PaymentHistoryTable from './components/PaymentHistoryTable';
import PaymentCalendar from './components/PaymentCalendar';
import MonthlyPaymentCard from '../../components/payment/MonthlyPaymentCard';
import PaymentScheduleTable from '../../components/payment/PaymentScheduleTable';
import { usePayments } from '../../hooks/usePayments';
import { useApplicationStatus } from '../../hooks/useApplicationStatus';
import { calculatePaymentSchedule, formatCurrency } from '../../utils/paymentCalculations';
import { useUserStore } from '../../store/userStore';

const PaymentHistory = () => {
  const [view, setView] = useState<'list' | 'calendar' | 'schedule'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const { upcomingPayment, recentPayments } = usePayments();
  const { applicationData } = useApplicationStatus();
  const { fetchPayments } = useUserStore();
  
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);
  
  const filteredPayments = recentPayments.filter(payment => {
    const matchesSearch = payment.date.includes(searchTerm) || 
      payment.amount.toString().includes(searchTerm) ||
      payment.status.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate loan details
  const monthlyRent = applicationData?.monthlyRent || 1200;
  const loanTerm = 12; // 12 months
  const interestRate = 28; // 28% annual interest rate
  
  // Apply some sample discounts for demonstration
  const discounts = {
    3: 50, // 50 GHS discount on 3rd payment
    6: 100, // 100 GHS discount on 6th payment
    9: 150 // 150 GHS discount on 9th payment
  };
  
  const paymentSchedule = calculatePaymentSchedule(monthlyRent * loanTerm, interestRate, loanTerm, discounts);
  
  // Calculate progress
  const paidAmount = recentPayments.reduce((sum, payment) => 
    payment.status === 'Completed' ? sum + payment.amount : sum, 0);
  
  const totalLoanAmount = monthlyRent * loanTerm;
  const remainingPayments = loanTerm - recentPayments.filter(p => p.status === 'Completed').length;
  
  const handlePaymentComplete = () => {
    fetchPayments();
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <div className="flex space-x-2">
          <Button
            variant={view === 'list' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            List View
          </Button>
          <Button
            variant={view === 'calendar' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('calendar')}
          >
            Calendar View
          </Button>
          <Button
            variant={view === 'schedule' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setView('schedule')}
          >
            Schedule View
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MonthlyPaymentCard
            applicationId={applicationData?.id || ''}
            monthlyAmount={monthlyRent}
            dueDate={upcomingPayment?.date || new Date().toISOString()}
            totalAmount={totalLoanAmount}
            paidAmount={paidAmount}
            remainingPayments={remainingPayments}
            totalPayments={loanTerm}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Loan Amount</span>
                <span className="font-medium">{formatCurrency(totalLoanAmount)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Monthly Payment</span>
                <span className="font-medium">{formatCurrency(paymentSchedule.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Interest</span>
                <span className="font-medium">{formatCurrency(paymentSchedule.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Payments</span>
                <span className="font-medium">{formatCurrency(paymentSchedule.totalPayments)}</span>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Discounts & Bonuses</h3>
              <p className="text-sm text-green-700">
                You have the following discounts:
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">3rd payment:</span>
                  <span className="font-medium text-green-800">-{formatCurrency(50)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">6th payment:</span>
                  <span className="font-medium text-green-800">-{formatCurrency(100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">9th payment:</span>
                  <span className="font-medium text-green-800">-{formatCurrency(150)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Payment Schedule</h3>
              <p className="text-sm text-blue-700">
                Payment window: 25th to 5th of each month
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Regular period:</span>
                  <span className="font-medium text-blue-800">25th - 5th</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Late fees:</span>
                  <span className="font-medium text-blue-800"></span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="text-blue-700">6th - 12th:</span>
                  <span className="font-medium text-blue-800">+10%</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="text-blue-700">13th - 18th:</span>
                  <span className="font-medium text-blue-800">+15%</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="text-blue-700">19th - 24th:</span>
                  <span className="font-medium text-blue-800">+25%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-700 mb-2">Contact Information</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Office Address: Nii Laryea Odumanye RD</li>
                <li>• Contact: 0204090400 / 0204090411</li>
              </ul>
            </div>
            
            <Button
              variant="outline"
              fullWidth
              leftIcon={<Download size={16} />}
            >
              Download Statement
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>
              {view === 'list' ? 'Payment Records' : 
               view === 'calendar' ? 'Payment Calendar' : 
               'Payment Schedule'}
            </CardTitle>
            {view === 'list' && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download size={16} />}
              >
                Export Records
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {view === 'list' && (
            <>
              {/* Filters and Search */}
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-sm text-primary-600 mb-1">Total Payments</div>
                  <div className="text-2xl font-bold text-primary-900">{filteredPayments.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 mb-1">Total Amount</div>
                  <div className="text-2xl font-bold text-green-900">
                    {formatCurrency(totalAmount)}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 mb-1">Average Payment</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(totalAmount / filteredPayments.length || 0)}
                  </div>
                </div>
              </div>
              
              <PaymentHistoryTable payments={filteredPayments} />
            </>
          )}
          
          {view === 'calendar' && <PaymentCalendar />}
          
          {view === 'schedule' && (
            <PaymentScheduleTable 
              schedule={paymentSchedule.schedule}
              currentPaymentNumber={loanTerm - remainingPayments}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;