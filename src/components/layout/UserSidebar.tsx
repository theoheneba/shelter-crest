import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, CreditCard, Files, UserCircle,
  Home, Calendar, MessageSquare, Bell, HelpCircle,
  Settings, Download, Upload, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApplicationStatus } from '../../hooks/useApplicationStatus';
import { useConditionalEligibility } from '../../hooks/useConditionalEligibility';
import Button from '../ui/Button';

const UserSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { status } = useApplicationStatus();
  const { isEligible, redirectToEligibilityCheck } = useConditionalEligibility();
  
  const menuItems = [
    {
      group: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        {
          path: isEligible ? '/application' : '/eligibility',
          label: 'My Application',
          icon: <FileText size={20} />,
          onClick: !isEligible ? redirectToEligibilityCheck : undefined
        },
        { path: '/payments', label: 'Payment History', icon: <CreditCard size={20} /> },
        { path: '/documents', label: 'Documents', icon: <Files size={20} /> },
        { path: '/shop', label: 'Shop', icon: <ShoppingBag size={20} /> }
      ]
    },
    {
      group: 'Support',
      items: [
        { path: '/tickets/create', label: 'Create Ticket', icon: <MessageSquare size={20} /> },
        { path: '/tickets', label: 'View Tickets', icon: <FileText size={20} /> },
        { path: '/help', label: 'Help Center', icon: <HelpCircle size={20} /> }
      ]
    },
    {
      group: 'Account',
      items: [
        { path: '/profile', label: 'Profile Settings', icon: <UserCircle size={20} /> },
        { path: '/notifications', label: 'Notifications', icon: <Bell size={20} /> }
      ]
    }
  ];
  
  return (
    <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 pt-16 z-10">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-medium">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        {/* Application Status */}
        <div className="mt-4">
          <div className="text-xs font-medium text-gray-500 mb-2">Application Status</div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full ${
            status === 'approved' 
              ? 'bg-green-100 text-green-800'
              : status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin scrollbar-thumb-gray-300">
        {menuItems.map((group, index) => (
          <div key={group.group}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {group.group}
            </h3>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={item.onClick}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-900'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
          <Upload size={16} className="mr-2" />
          Upload Document
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;