import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Search, Filter, Download, Upload, Eye,
  CheckCircle, AlertTriangle, Clock, Trash2, Edit2,
  ZoomIn, RotateCw, MessageSquare, Flag, Lock,
  RefreshCw, Archive
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAdminStore } from '../../store/adminStore';
import { toast } from 'react-hot-toast';

const DocumentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isVerifying, setIsVerifying] = useState(false);

  const { 
    documents, 
    fetchDocuments, 
    verifyDocument, 
    selectedDocument, 
    setSelectedDocument,
    loading,
    setupSubscriptions,
    cleanup
  } = useAdminStore();

  useEffect(() => {
    fetchDocuments();
    setupSubscriptions();
    
    return () => cleanup();
  }, [fetchDocuments, setupSubscriptions, cleanup]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      verified: { icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      in_review: { icon: Eye, className: 'bg-blue-100 text-blue-800' },
      rejected: { icon: AlertTriangle, className: 'bg-red-100 text-red-800' }
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

  const getPriorityIndicator = (priority: string) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    };

    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full ${colors[priority as keyof typeof colors].replace('text', 'bg')} mr-2`}></div>
        <span className={`text-sm ${colors[priority as keyof typeof colors]}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>
    );
  };

  const handleVerifyDocument = async () => {
    if (!selectedDocument) return;
    
    setIsVerifying(true);
    try {
      await verifyDocument(selectedDocument.id, 'verified');
      toast.success('Document verified successfully');
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error('Failed to verify document');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRejectDocument = async () => {
    if (!selectedDocument) return;
    
    setIsVerifying(true);
    try {
      await verifyDocument(selectedDocument.id, 'rejected');
      toast.success('Document rejected');
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('Failed to reject document');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRequestInfo = () => {
    toast.success('Additional information requested');
    setSelectedDocument(null);
  };

  const handleFlagForReview = () => {
    toast.success('Document flagged for review');
    setSelectedDocument(null);
  };

  // Filter documents based on search and type filter
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.user?.first_name + ' ' + doc.user?.last_name).toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || doc.document_type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<Download size={18} />}
          >
            Export Report
          </Button>
          <Button
            leftIcon={<Upload size={18} />}
          >
            Upload Documents
          </Button>
        </div>
      </div>

      {/* Document Statistics */}
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
                  <p className="text-sm font-medium text-blue-600">Total Documents</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">{documents.length}</h3>
                  <p className="text-sm text-blue-600 mt-1">+12% from last month</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-700" />
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
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Verified</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">
                    {documents.filter(doc => doc.status === 'verified').length}
                  </h3>
                  <p className="text-sm text-green-600 mt-1">
                    {Math.round((documents.filter(doc => doc.status === 'verified').length / documents.length) * 100)}% success rate
                  </p>
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
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                  <h3 className="text-2xl font-bold text-yellow-900 mt-1">
                    {documents.filter(doc => doc.status === 'pending').length}
                  </h3>
                  <p className="text-sm text-yellow-600 mt-1">Avg. 2.3 days</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-700" />
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
          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Rejected</p>
                  <h3 className="text-2xl font-bold text-red-900 mt-1">
                    {documents.filter(doc => doc.status === 'rejected').length}
                  </h3>
                  <p className="text-sm text-red-600 mt-1">Needs attention</p>
                </div>
                <div className="p-3 bg-red-200 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Document Queue */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Document Queue</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Types</option>
                  <option value="identification">Identification</option>
                  <option value="employment">Employment</option>
                  <option value="financial">Financial</option>
                  <option value="rental">Rental Agreement</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No documents found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doc.file_name}</div>
                            <div className="text-sm text-gray-500">2.4 MB</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.user?.first_name} {doc.user?.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityIndicator(doc.status === 'pending' ? 'high' : 'medium')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-primary-600 hover:text-primary-900"
                            onClick={() => setSelectedDocument(doc)}
                          >
                            <Eye size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit2 size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={18} />
                          </button>
                        </div>
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

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Document Review</h2>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex">
              {/* Document Preview */}
              <div className="w-2/3 bg-gray-100 p-6 overflow-auto">
                <div className="bg-white rounded-lg shadow-lg p-4 h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FileText size={48} className="mx-auto mb-4" />
                    <p>Document preview would appear here</p>
                  </div>
                </div>
              </div>

              {/* Document Info & Actions */}
              <div className="w-1/3 border-l border-gray-200 overflow-auto">
                <div className="p-6 space-y-6">
                  {/* Document Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Document Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Status</dt>
                        <dd>{getStatusBadge(selectedDocument.status)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Upload Date</dt>
                        <dd className="text-gray-900">{new Date(selectedDocument.created_at).toLocaleDateString()}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">File Size</dt>
                        <dd className="text-gray-900">2.4 MB</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Document Type</dt>
                        <dd className="text-gray-900">{selectedDocument.document_type}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Verification Checklist */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Verification Checklist</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600" />
                        <span className="ml-2 text-gray-700">Document is clear and legible</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600" />
                        <span className="ml-2 text-gray-700">Information matches application</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600" />
                        <span className="ml-2 text-gray-700">No signs of tampering</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-5 w-5 text-primary-600" />
                        <span className="ml-2 text-gray-700">Dates are valid</span>
                      </label>
                    </div>
                  </div>

                  {/* Verification Results */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Verification Results</h3>
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-700 font-medium">OCR Confidence: 98%</span>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Lock className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-green-700 font-medium">Fraud Score: 0.02</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <Button
                      variant="primary"
                      fullWidth
                      isLoading={isVerifying}
                      onClick={handleVerifyDocument}
                    >
                      Verify Document
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<MessageSquare size={18} />}
                      onClick={handleRequestInfo}
                    >
                      Request Additional Information
                    </Button>
                    <Button
                      variant="outline"
                      fullWidth
                      leftIcon={<Flag size={18} />}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={handleFlagForReview}
                    >
                      Flag for Review
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;