import { useState } from 'react';
import { Upload, FileText, Filter, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import DocumentsList from './components/DocumentsList';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <Button
          onClick={handleUpload}
          isLoading={isUploading}
          leftIcon={<Upload size={18} />}
        >
          Upload New Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText size={24} className="text-primary-800" />
              </div>
              <span className="text-2xl font-bold">12</span>
            </div>
            <h3 className="mt-2 font-medium">Total Documents</h3>
            <p className="text-sm text-gray-500">All uploaded documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText size={24} className="text-green-800" />
              </div>
              <span className="text-2xl font-bold">8</span>
            </div>
            <h3 className="mt-2 font-medium">Verified Documents</h3>
            <p className="text-sm text-gray-500">Approved and verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText size={24} className="text-orange-800" />
              </div>
              <span className="text-2xl font-bold">4</span>
            </div>
            <h3 className="mt-2 font-medium">Pending Documents</h3>
            <p className="text-sm text-gray-500">Awaiting verification</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                <option value="income">Income Proof</option>
                <option value="lease">Lease Agreement</option>
                <option value="employment">Employment</option>
              </select>
            </div>
          </div>

          {/* Documents List */}
          <DocumentsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;