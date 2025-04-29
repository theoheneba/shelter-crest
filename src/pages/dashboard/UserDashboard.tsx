import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, ArrowRight, AlertCircle, User, Clock, CheckCircle, 
  FileText, BarChart2, Info, DollarSign, Home, CreditCard,
  Upload, Download, Eye, MessageSquare, Bell
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import PaymentCalendar from './components/PaymentCalendar';
import DocumentsList from './components/DocumentsList';
import ApplicationStatusCard from './components/ApplicationStatusCard';
import PaymentHistoryTable from './components/PaymentHistoryTable';
import { useApplicationStatus } from '../../hooks/useApplicationStatus';
import { usePayments } from '../../hooks/usePayments';
import { calculateInitialPayment, calculateLatePaymentFee, formatCurrency, calculatePaymentSchedule } from '../../utils/paymentCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PaymentModal from '../../components/payment/PaymentModal';
import { paymentService } from '../../services/paymentService';
import { useUserStore } from '../../store/userStore';
import MonthlyPaymentCard from '../../components/payment/MonthlyPaymentCard';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const paymentHistory = [
  { month: 'Jan', amount: 1200, onTime: true },
  { month: 'Feb', amount: 1200, onTime: true },
  { month: 'Mar', amount: 1200, onTime: false },
  { month: 'Apr', amount: 1200, onTime: true },
  { month: 'May', amount: 1200, onTime: true },
  { month: 'Jun', amount: 1200, onTime: true }
];

const UserDashboard = () => {
  const { user } = useAuth();
  const { status, applicationData } = useApplicationStatus();
  const { upcomingPayment, recentPayments } = usePayments();
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'documents'>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { applications, fetchApplications, fetchPayments, setupSubscriptions, cleanup } = useUserStore();

  useEffect(() => {
    fetchApplications();
    fetchPayments();
    setupSubscriptions();
    return () => cleanup();
  }, [fetchApplications, fetchPayments, setupSubscriptions, cleanup]);

  const monthlyRent = applicationData?.monthlyRent || 1200;
  const initialPayment = calculateInitialPayment(monthlyRent);
  
  const today = new Date();
  const currentDayOfMonth = today.getDate();
  const lateFee = calculateLatePaymentFee(monthlyRent, currentDayOfMonth);
  
  const calculateProfileCompletion = () => {
    return 75;
  };
  
  const profileCompletionPercentage = calculateProfileCompletion();

  // Calculate loan details
  const loanTerm = 12; // 12 months
  const interestRate = 28; // 28% annual interest rate
  const totalLoanAmount = monthlyRent * loanTerm;
  
  // Apply some sample discounts for demonstration
  const discounts = {
    3: 50, // 50 GHS discount on 3rd payment
    6: 100, // 100 GHS discount on 6th payment
    9: 150 // 150 GHS discount on 9th payment
  };
  
  const paymentSchedule = calculatePaymentSchedule(totalLoanAmount, interestRate, loanTerm, discounts);
  const paidAmount = recentPayments.reduce((sum, payment) => 
    payment.status === 'Completed' ? sum + payment.amount : sum, 0);
  const remainingPayments = loanTerm - recentPayments.filter(p => p.status === 'Completed').length;

  const totalPaid = recentPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const onTimePayments = paymentHistory.filter(payment => payment.onTime).length;
  const paymentReliability = (onTimePayments / paymentHistory.length) * 100;

  const handlePaymentSuccess = async (reference: string) => {
    try {
      await paymentService.verifyPayment({
        reference,
        amount: monthlyRent,
        applicationId: applicationData?.id || ''
      });
      fetchPayments();
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  };

  const renderOverviewContent = () => (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ApplicationStatusCard status={status} />
        
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="mr-4 p-3 bg-white rounded-lg shadow-md">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary-900">Next Payment</h2>
                {status === 'approved' && upcomingPayment ? (
                  <>
                    <p className="mt-2 text-2xl font-bold text-primary-800">{formatCurrency(upcomingPayment.amount)}</p>
                    <p className="mt-1 text-sm text-primary-600">
                      Due in {upcomingPayment.daysUntil} days ({new Date(upcomingPayment.date).toLocaleDateString()})
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-gray-600">
                    Payments will be scheduled after approval
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="mr-4 p-3 bg-white rounded-lg shadow-md">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-green-900">Payment Reliability</h2>
                <p className="mt-2 text-2xl font-bold text-green-800">{paymentReliability.toFixed(1)}%</p>
                <p className="mt-1 text-sm text-green-600">On-time payment rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600">Monthly Rent</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(monthlyRent)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600">Total Rent Paid</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-600">Next Due</h3>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {upcomingPayment ? formatCurrency(upcomingPayment.amount) : '-'}
                    </p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="amount" 
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-2">Payment Schedule:</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <li className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span>Regular period: 25th - 5th</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>6th - 12th: +10% fee</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                          <span>13th - 18th: +15% fee</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>19th - 24th: +25% fee</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                    <User className="h-8 w-8 text-accent-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-accent-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-accent-600">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-accent-700">Profile Completion</span>
                    <span className="font-medium text-accent-900">{profileCompletionPercentage}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 shadow-inner">
                    <motion.div 
                      className="bg-accent-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompletionPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <Link to="/profile">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    className="bg-white text-accent-700 border-accent-200 hover:bg-accent-50"
                  >
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<CreditCard size={18} />}
                  onClick={() => setShowPaymentModal(true)}
                >
                  Make Payment
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Upload size={18} />}
                >
                  Upload Document
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<MessageSquare size={18} />}
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Download size={18} />}
                >
                  Download Statement
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Bell size={16} className="text-primary-600 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-900">Payment reminder</p>
                    <p className="text-xs text-gray-500">Due in 3 days</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle size={16} className="text-green-600 mt-1 mr-2" />
                  <div>
                    <p className="text-sm text-gray-900">Document verified</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Monthly Payment</CardTitle>
              <Link to="/payments">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary-800 font-medium"
                  rightIcon={<ArrowRight size={16} />}
                >
                  View All Payments
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <MonthlyPaymentCard
              applicationId={applicationData?.id || ''}
              monthlyAmount={paymentSchedule.monthlyPayment}
              dueDate={upcomingPayment?.date || new Date().toISOString()}
              totalAmount={totalLoanAmount}
              paidAmount={paidAmount}
              remainingPayments={remainingPayments}
              totalPayments={loanTerm}
              onPaymentComplete={() => fetchPayments()}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Payments</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('payments')}
                className="text-primary-800 font-medium"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PaymentHistoryTable payments={recentPayments.slice(0, 3)} />
          </CardContent>
        </Card>
      </motion.div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={monthlyRent}
        dueDate={upcomingPayment?.date || new Date().toISOString()}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );

  const renderPaymentsContent = () => (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Payment Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentCalendar />
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeIn}>
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentHistoryTable payments={recentPayments} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  const renderDocumentsContent = () => (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
    >
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentsList />
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your rent assistance.</p>
        </div>
      </motion.div>
      
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {['overview', 'payments', 'documents'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`mr-8 py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>
      
      {activeTab === 'overview' && renderOverviewContent()}
      {activeTab === 'payments' && renderPaymentsContent()}
      {activeTab === 'documents' && renderDocumentsContent()}
    </div>
  );
};

export default UserDashboard;