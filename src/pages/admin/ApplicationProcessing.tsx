import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle, XCircle, AlertTriangle,
  Search, Filter, Eye, ArrowRight, BarChart2, Users,
  Calendar, DollarSign
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAdminStore } from '../../store/adminStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ApplicationProcessing = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    sla: 'all'
  });

  const { 
    applications, 
    fetchApplications, 
    updateApplication, 
    selectedApplication, 
    setSelectedApplication,
    loading,
    setupSubscriptions,
    cleanup
  } = useAdminStore();

  useEffect(() => {
    fetchApplications();
    setupSubscriptions();
    
    return () => cleanup();
  }, [fetchApplications, setupSubscriptions, cleanup]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      in_review: { icon: FileText, className: 'bg-blue-100 text-blue-800' },
      approved: { icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      rejected: { icon: XCircle, className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        <Icon size={12} className="mr-1" />
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  const getRiskIndicator = (score: number) => {
    let color = 'text-red-500';
    if (score >= 80) color = 'text-green-500';
    else if (score >= 60) color = 'text-yellow-500';

    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')} mr-2`}></div>
        <span className={`text-sm ${color}`}>{score}</span>
      </div>
    );
  };

  const getSlaIndicator = (status: string) => {
    const config = {
      within_limit: { color: 'text-green-500', bg: 'bg-green-100' },
      warning: { color: 'text-yellow-500', bg: 'bg-yellow-100' },
      overdue: { color: 'text-red-500', bg: 'bg-red-100' }
    };

    const style = config[status as keyof typeof config] || config.within_limit;

    return (
      <div className={`px-2 py-1 rounded-full ${style.bg} ${style.color} text-xs font-medium`}>
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </div>
    );
  };

  const handleReviewApplication = (application: any) => {
    setSelectedApplication(application);
  };

  const handleApproveApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      await updateApplication(selectedApplication.id, {
        status: 'approved',
        reviewed_at: new Date().toISOString()
      });
      
      setSelectedApplication(null);
      toast.success('Application approved successfully');
    } catch (error) {
      console.error('Error approving application:', error);
    }
  };

  const handleRejectApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      await updateApplication(selectedApplication.id, {
        status: 'rejected',
        reviewed_at: new Date().toISOString()
      });
      
      setSelectedApplication(null);
      toast.success('Application rejected');
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
  };

  const handleViewAnalytics = () => {
    navigate('/admin/analytics');
  };

  const handleManageTeam = () => {
    navigate('/admin/users');
  };

  // Filter applications based on search term and filters
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = filters.status === 'all' || app.status === filters.status;
    const matchesPriority = filters.priority === 'all' || app.priority === filters.priority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Application Processing</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<BarChart2 size={18} />}
            onClick={handleViewAnalytics}
          >
            View Analytics
          </Button>
          <Button
            leftIcon={<Users size={18} />}
            onClick={handleManageTeam}
          >
            Manage Team
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Pending Review</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">
                    {applications.filter(app => app.status === 'pending').length}
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">5 high priority</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-700" />
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Processing Time</p>
                  <h3 className="text-2xl font-bold text-yellow-900 mt-1">2.3</h3>
                  <p className="text-sm text-yellow-600 mt-1">Avg. days</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-700" />
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Approval Rate</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">85%</h3>
                  <p className="text-sm text-green-600 mt-1">Last 30 days</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Value</p>
                  <h3 className="text-2xl font-bold text-purple-900 mt-1">GH₵ 245K</h3>
                  <p className="text-sm text-purple-600 mt-1">Pending approval</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Applications Queue</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="in_review">Document Verification</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No applications found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completeness</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{application.id}</div>
                            <div className="text-sm text-gray-500">{application.applicant.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRiskIndicator(application.riskScore)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-600 rounded-full"
                              style={{ width: `${application.completeness}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {application.completeness}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSlaIndicator('within_limit')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReviewApplication(application)}
                          rightIcon={<ArrowRight size={16} />}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Application Review</h2>
                  <p className="text-gray-600">Review and process application {selectedApplication.id}</p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle size={24} />
                </button>
              </div>

              {/* Application details */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Applicant Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{selectedApplication.applicant.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedApplication.applicant.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{selectedApplication.applicant.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Application Date</p>
                          <p className="font-medium">{new Date(selectedApplication.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold">Financial Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Monthly Rent</p>
                          <p className="font-medium">GH₵ {selectedApplication.monthly_rent}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Deposit Amount</p>
                          <p className="font-medium">GH₵ {selectedApplication.deposit_amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Interest Amount</p>
                          <p className="font-medium">GH₵ {selectedApplication.interest_amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Initial Payment</p>
                          <p className="font-medium">GH₵ {selectedApplication.total_initial_payment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Risk Assessment</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Risk Score</p>
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                selectedApplication.riskScore >= 80 ? 'bg-green-500' :
                                selectedApplication.riskScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${selectedApplication.riskScore}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-medium">{selectedApplication.riskScore}</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Completeness</p>
                        <div className="flex items-center">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary-600 rounded-full"
                              style={{ width: `${selectedApplication.completeness}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 font-medium">{selectedApplication.completeness}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold">Documents</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <p className="text-sm">ID Verification</p>
                          <CheckCircle size={16} className="text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Proof of Income</p>
                          <CheckCircle size={16} className="text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Rental Agreement</p>
                          <CheckCircle size={16} className="text-green-500" />
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Employment Verification</p>
                          <Clock size={16} className="text-yellow-500" />
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold">Notes</h3>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={4}
                      placeholder="Add notes about this application..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApplication(null)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  onClick={handleRejectApplication}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<CheckCircle size={18} />}
                  onClick={handleApproveApplication}
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationProcessing;