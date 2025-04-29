import { useState } from 'react';
import { Search, Book, MessageSquare, Phone, Mail, ArrowRight, FileText } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock help articles data
const helpArticles = [
  {
    id: '1',
    title: 'Getting Started with RentAssist',
    category: 'general',
    content: 'Learn how to use RentAssist to manage your rent assistance application...',
    views: 1245,
    helpful: 92
  },
  {
    id: '2',
    title: 'Understanding Payment Schedules',
    category: 'payments',
    content: 'Everything you need to know about payment schedules and due dates...',
    views: 987,
    helpful: 88
  },
  {
    id: '3',
    title: 'Document Upload Guidelines',
    category: 'documents',
    content: 'Learn about required documents and how to upload them correctly...',
    views: 756,
    helpful: 95
  }
];

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
        <Button
          variant="outline"
          leftIcon={<MessageSquare size={18} />}
        >
          Contact Support
        </Button>
      </div>

      {/* Search and Categories */}
      <Card>
        <CardContent className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Topics
              </button>
              <button
                onClick={() => setSelectedCategory('general')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'general'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setSelectedCategory('payments')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'payments'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setSelectedCategory('documents')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'documents'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Documents
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {helpArticles.map((article) => (
              <div
                key={article.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Book size={20} className="text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{article.content}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>{article.views} views</span>
                      <span className="mx-2">•</span>
                      <span>{article.helpful}% found this helpful</span>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Live Chat</h3>
                  <p className="text-sm text-gray-500">Chat with our support team</p>
                </div>
              </div>
              <Button size="sm" className="w-full mt-4">Start Chat</Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Phone size={24} className="text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Phone Support</h3>
                  <p className="text-sm text-gray-500">Call us at +233 55 123 4567</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-4">Call Now</Button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail size={24} className="text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Email Support</h3>
                  <p className="text-sm text-gray-500">support@rentassist.com</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-4">Send Email</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpCenter;