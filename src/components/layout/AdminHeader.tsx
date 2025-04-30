import { Bell, Moon, Sun, Menu, X, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const AdminHeader = ({ sidebarOpen, onToggleSidebar, theme, onToggleTheme }: AdminHeaderProps) => {
  return (
    <header className={`fixed top-0 right-0 left-0 h-16 z-30 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } border-b shadow-sm`}>
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center flex-1">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
            }`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="ml-4 flex-1 max-w-xl relative hidden sm:block">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
              }`} size={18} />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <button className="relative p-2">
            <Bell size={20} className={theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">AD</span>
            </div>
            <div className="ml-3 hidden sm:block">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}>Admin User</p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;