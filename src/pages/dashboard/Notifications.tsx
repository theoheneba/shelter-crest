import { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Clock, Calendar, DollarSign, FileText, Trash2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'payment',
    title: 'Upcoming Payment Reminder',
    message: 'Your next payment of GH₵ 1,200 is due in 3 days.',
    timestamp: '2025-04-13T10:30:00Z',
    status: 'unread',
    priority: 'high'
  },
  {
    id: '2',
    type: 'document',
    title: 'Document Verified',
    message: 'Your proof of income document has been verified successfully.',
    timestamp: '2025-04-12T15:45:00Z',
    status: 'read',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'application',
    title: 'Application Update',
    message: 'Your application is currently under review by our team.',
    timestamp: '2025-04-11T09:20:00Z',
    status: 'read',
    priority: 'low'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="text-blue-500" />;
      case 'document':
        return <FileText className="text-green-500" />;
      case 'application':
        return <Calendar className="text-purple-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <Button
          variant="outline"
          onClick={markAllAsRead}
          leftIcon={<CheckCircle size={18} />}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">All Notifications</p>
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
                <AlertTriangle className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

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

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">High Priority</p>
                <h3 className="text-2xl font-bold text-purple-900 mt-1">
                  {notifications.filter(n => n.priority === 'high').length}
                </h3>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <Clock className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Notifications</CardTitle>
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
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.status === 'unread'
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getNotificationIcon(notification.type)}
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
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No notifications found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;