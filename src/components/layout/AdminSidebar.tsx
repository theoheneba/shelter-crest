import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  Building,
  CreditCard,
  Files,
  Cog,
  MessageSquare
} from 'lucide-react';

interface AdminSidebarProps {
  open: boolean;
  theme: 'light' | 'dark';
}

const AdminSidebar = ({ open, theme }: AdminSidebarProps) => {
  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/applications', icon: FileText, label: 'Applications' },
    { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { path: '/admin/documents', icon: Files, label: 'Documents' },
    { path: '/admin/configuration', icon: Cog, label: 'Configuration' },
    { path: '/admin/support', icon: MessageSquare, label: 'Support' },
    { path: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/admin/properties', icon: Building, label: 'Properties' },
    { path: '/admin/security', icon: Shield, label: 'Security' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/help', icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-screen transition-all duration-300 z-20 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } ${open ? 'w-64' : 'w-20'} border-r ${
      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
    } pt-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600`}>
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100' 
                      : `${theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-100'}`
                    }
                  `}
                >
                  <Icon size={20} />
                  {open && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;