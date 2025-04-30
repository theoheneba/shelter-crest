import { useState } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock tickets data
const mockTickets = [
  {
    id: 'TKT001',
    subject: 'Payment Processing Issue',
    category: 'payment',
    priority: 'high',
    status: 'open',
    createdAt: '2025-04-15T10:30:00Z',
    lastUpdated: '2025-04-15T14:45:00Z',
    messages: [
      {
        id: 'MSG001',
        sender: 'user',
        content: 'I am having issues with my payment processing.',
        timestamp: '2025-04-15T10:30:00Z'
      },
      {
        id: 'MSG002',
        sender: 'support',
        content: 'Thank you for reaching out. Could you please provide more details about the issue?',
        timestamp: '2025-04-15T14:45:00Z'
      }
    ]
  },
  {
    id: 'TKT002',
    subject: 'Document Verification Query',
    category: 'document',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2025-04-14T09:15:00Z',
    lastUpdated: '2025-04-14T13:20:00Z',
    messages: [
      {
        id: 'MSG003',
        sender: 'user',
        content: 'How long does document verification usually take?',
        timestamp: '2025-04-14T09:15:00Z'
      }
    ]
  }
];

const ViewTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      in_progress: { icon: MessageSquare, className: 'bg-blue-100 text-blue-800' },
      resolved: { icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      closed: { icon: AlertTriangle, className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        <Icon size={12} className="mr-1" />
        {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Support Tickets</h1>
        <Button
          leftIcon={<MessageSquare size={18} />}
        >
          Create New Ticket
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Tickets</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tickets..."
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
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setSelectedTicket(ticket.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium text-gray-900">{ticket.subject}</h3>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Last updated: {new Date(ticket.lastUpdated).toLocaleString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Ticket ID: {ticket.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      ticket.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : ticket.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Ticket Details</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {/* Messages */}
              <div className="space-y-4">
                {mockTickets
                  .find(t => t.id === selectedTicket)
                  ?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-lg rounded-lg p-4 ${
                          message.sender === 'user'
                            ? 'bg-primary-100 text-primary-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Reply Box */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTickets;