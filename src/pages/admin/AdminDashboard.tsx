import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, DollarSign, TrendingUp, AlertCircle, 
  CheckCircle, Calendar, ArrowUpRight, Filter, Search,
  User
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAdminStore } from '../../store/adminStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('7d');
  const [statusFilter, setStatusFilter] = useState('all');
  const { 
    applications, 
    fetchApplications, 
    setSelectedApplication,
    fetchUsers,
    fetchPayments,
    fetchDocuments,
    setupSubscriptions,
    cleanup
  } = useAdminStore();

  useEffect(() => {
    fetchApplications();
    fetchUsers();
    fetchPayments();
    fetchDocuments();
    setupSubscriptions();
    
    return () => cleanup();
  }, [fetchApplications, fetchUsers, fetchPayments, fetchDocuments, setupSubscriptions, cleanup]);

  const handleReviewApplication = (application: any) => {
    setSelectedApplication(application);
    navigate('/admin/applications');
  };

  const handleVerifyDocuments = () => {
    navigate('/admin/documents');
  };

  const handleProcessPayments = () => {
    navigate('/admin/payments');
  };

  // Stats for the dashboard
  const stats = {
    totalApplications: applications.length,
    pendingReview: applications.filter(app => app.status === 'pending').length,
    approvedToday: applications.filter(app => app.status === 'approved' && 
      new Date(app.updated_at).toDateString() === new Date().toDateString()).length,
    totalDisbursed: applications
      .filter(app => app.status === 'approved')
      .reduce((sum, app) => sum + app.total_initial_payment, 0),
    recentApplications: applications
      .filter(app => app.status === 'pending')
      .slice(0, 3),
    performanceMetrics: {
      approvalRate: 85,
      avgProcessingTime: 2.3,
      defaultRate: 3.2
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-primary-600">Total Applications</p>
                  <h3 className="text-2xl font-bold text-primary-900 mt-2">{stats.totalApplications}</h3>
                  <p className="text-sm text-primary-600 mt-1">+12% from last month</p>
                </div>
                <div className="p-3 bg-primary-200 rounded-lg">
                  <FileText className="h-6 w-6 text-primary-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                  <h3 className="text-2xl font-bold text-yellow-900 mt-2">{stats.pendingReview}</h3>
                  <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-green-600">Approved Today</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-2">{stats.approvedToday}</h3>
                  <p className="text-sm text-green-600 mt-1">+3 since yesterday</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Disbursed</p>
                  <h3 className="text-2xl font-bold text-purple-900 mt-2">
                    GH₵ {stats.totalDisbursed.toLocaleString()}
                  </h3>
                  <p className="text-sm text-purple-600 mt-1">+8.2% from last month</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Applications</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/applications')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.applicant.name}</p>
                        <p className="text-sm text-gray-500">{app.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">GH₵ {app.monthly_rent}</p>
                      <p className="text-sm text-gray-500">{new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Performance Metrics</CardTitle>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-green-600">Approval Rate</p>
                      <h4 className="text-2xl font-bold text-green-900">{stats.performanceMetrics.approvalRate}%</h4>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Avg. Processing Time</p>
                      <h4 className="text-2xl font-bold text-blue-900">{stats.performanceMetrics.avgProcessingTime} days</h4>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-red-600">Default Rate</p>
                      <h4 className="text-2xl font-bold text-red-900">{stats.performanceMetrics.defaultRate}%</h4>
                    </div>
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Required Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-900">Pending Reviews</p>
                    <p className="text-2xl font-bold text-yellow-700 mt-1">12</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-yellow-500 text-yellow-700"
                    onClick={() => navigate('/admin/applications')}
                  >
                    Review Now
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-purple-900">Document Verifications</p>
                    <p className="text-2xl font-bold text-purple-700 mt-1">8</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-purple-500 text-purple-700"
                    onClick={handleVerifyDocuments}
                  >
                    Verify
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Payment Approvals</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">5</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-blue-500 text-blue-700"
                    onClick={handleProcessPayments}
                  >
                    Process
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;