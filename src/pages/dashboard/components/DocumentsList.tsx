import { useState } from 'react';
import { FileText, Download, Eye, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';

// Mock documents data
const mockDocuments = [
  { 
    id: '1', 
    name: 'Proof of Income', 
    type: 'Pay Stub', 
    uploadDate: '2025-04-10', 
    status: 'Verified',
    url: '#'
  },
  { 
    id: '2', 
    name: 'Rental Agreement', 
    type: 'Lease Document', 
    uploadDate: '2025-04-10', 
    status: 'Verified',
    url: '#'
  },
  { 
    id: '3', 
    name: 'Employment Verification', 
    type: 'Letter', 
    uploadDate: '2025-04-15', 
    status: 'Pending Verification',
    url: '#'
  },
  { 
    id: '4', 
    name: 'Personal ID', 
    type: 'Identification', 
    uploadDate: '2025-04-15', 
    status: 'Verified',
    url: '#'
  },
];

const DocumentsList = () => {
  const [isUploading, setIsUploading] = useState(false);
  
  const getStatusIcon = (status: string) => {
    if (status === 'Verified') {
      return <CheckCircle size={16} className="text-green-500" />;
    } else if (status === 'Pending Verification') {
      return <AlertCircle size={16} className="text-orange-500" />;
    }
    return null;
  };
  
  const getStatusClass = (status: string) => {
    if (status === 'Verified') {
      return 'bg-green-100 text-green-800';
    } else if (status === 'Pending Verification') {
      return 'bg-orange-100 text-orange-800';
    }
    return '';
  };
  
  const handleUpload = () => {
    // In a real app, this would open a file picker and handle the upload
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">Upload your documents for verification</p>
        <Button 
          size="sm" 
          onClick={handleUpload} 
          isLoading={isUploading}
          leftIcon={<Upload size={16} />}
        >
          Upload Document
        </Button>
      </div>
      
      {mockDocuments.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={18} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {doc.type}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                      <span className="ml-1">{doc.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-gray-500 hover:text-primary-800 transition-colors" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-primary-800 transition-colors" title="Download">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <FileText size={48} className="mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No Documents</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't uploaded any documents yet.</p>
          <Button
            className="mt-4"
            size="sm"
            leftIcon={<Upload size={16} />}
            onClick={handleUpload}
          >
            Upload Document
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;