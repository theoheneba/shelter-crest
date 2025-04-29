import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Book, MessageCircle, Phone, Mail, FileText, ExternalLink } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

const HelpSupport = () => {
  const handleContactSupport = () => {
    toast.success('Support contact form would open here');
  };

  const handleReadMore = (guide: string) => {
    toast.success(`Opening ${guide} documentation`);
  };

  const handleStartChat = () => {
    toast.success('Live chat would start here');
  };

  const handleCallNow = () => {
    toast.success('Initiating call to support');
  };

  const handleSendEmail = () => {
    toast.success('Opening email client');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <Button
          variant="outline"
          leftIcon={<MessageCircle size={18} />}
          onClick={handleContactSupport}
        >
          Contact Support
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Support Tickets</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">12</h3>
                  <p className="text-sm text-blue-600 mt-1">3 pending responses</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-700" />
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
                  <p className="text-sm font-medium text-green-600">Documentation</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">25</h3>
                  <p className="text-sm text-green-600 mt-1">Help articles</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <Book className="h-6 w-6 text-green-700" />
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
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Response Time</p>
                  <h3 className="text-2xl font-bold text-purple-900 mt-1">2.5h</h3>
                  <p className="text-sm text-purple-600 mt-1">Average</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <Phone className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Help Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Getting Started Guide</h3>
                      <p className="mt-1 text-gray-600">Learn the basics of the admin dashboard and its features.</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2" 
                        rightIcon={<ExternalLink size={14} />}
                        onClick={() => handleReadMore('Getting Started')}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Application Processing</h3>
                      <p className="mt-1 text-gray-600">Step-by-step guide for processing rent assistance applications.</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2" 
                        rightIcon={<ExternalLink size={14} />}
                        onClick={() => handleReadMore('Application Processing')}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Payment Management</h3>
                      <p className="mt-1 text-gray-600">Learn how to manage payments and process transactions.</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-2" 
                        rightIcon={<ExternalLink size={14} />}
                        onClick={() => handleReadMore('Payment Management')}
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Phone Support</p>
                  <p className="text-sm text-gray-600">Mon-Fri, 9AM-5PM</p>
                  <p className="text-sm font-medium text-primary-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Email Support</p>
                  <p className="text-sm text-gray-600">24/7 Response</p>
                  <p className="text-sm font-medium text-primary-600">support@rentassist.com</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Live Chat</p>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={handleStartChat}
                  >
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">How do I process a new application?</h3>
              <p className="mt-2 text-gray-600">
                Navigate to the Applications section, click on any pending application, review the submitted documents,
                and use the approval/rejection buttons to process the application.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">How do I generate reports?</h3>
              <p className="mt-2 text-gray-600">
                Visit the Analytics section, select your desired date range and metrics, then click the
                "Generate Report" button. You can export reports in various formats.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">How do I manage user roles?</h3>
              <p className="mt-2 text-gray-600">
                Go to User Management, select a user, and use the role dropdown to modify their permissions.
                Changes take effect immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;