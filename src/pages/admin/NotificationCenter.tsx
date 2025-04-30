import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, Filter, Search, Mail, MessageSquare, AlertTriangle, CheckCircle, Clock, Trash2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'application',
    title: 'New Application Submitted',
    message: 'John Doe has submitted a new rent assistance application.',
    timestamp: '2025-04-10T10:30:00Z',
    status: 'unread',
    priority: 'high'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Overdue',
    message: 'Payment for APP-123 is overdue by 5 days.',
    timestamp: '2025-04-09T15:45:00Z',
    status: 'unread',
    priority: 'high'
  },
  {
    id: '3',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur on April 15th at 02:00 GMT.',
    timestamp: '2025-04-08T09:00:00Z',
    status: 'read',
    priority: 'medium'
  }
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'application':
        return <MessageSquare className={`h-5 w-5 ${priority === 'high' ? 'text-red-500' : 'text-blue-500'}`} />;
      case 'payment':
        return <AlertTriangle className={`h-5 w-5 ${priority === 'high' ? 'text-red-500' : 'text-orange-500'}`} />;
      case 'system':
        return <Settings className={`h-5 w-5 ${priority === 'high' ? 'text-red-500' : 'text-gray-500'}`} />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.status === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          leftIcon={<CheckCircle size={18} />}
        >
          Mark All as Read
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">High Priority</p>
                  <h3 className="text-2xl font-bold text-red-900 mt-1">
                    {notifications.filter(n => n.priority === 'high').length}
                  </h3>
                </div>
                <div className="p-3 bg-red-200 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-700" />
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
                  <p className="text-sm font-medium text-yellow-600">Unread</p>
                  <h3 className="text-2xl font-bold text-yellow-900 mt-1">
                    {notifications.filter(n => n.status === 'unread').length}
                  </h3>
                </div>
                <div className="p-3 bg-yellow-200 rounded-lg">
                  <Mail className="h-6 w-6 text-yellow-700" />
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
                  <p className="text-sm font-medium text-green-600">Read</p>
                  <h3 className="text-2xl font-bold text-green-900 mt-1">
                    {notifications.filter(n => n.status === 'read').length}
                  </h3>
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total</p>
                  <h3 className="text-2xl font-bold text-blue-900 mt-1">
                    {notifications.length}
                  </h3>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Notifications</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border ${
                  notification.status === 'unread'
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{notification.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        <Clock className="inline-block h-3 w-3 mr-1" />
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;