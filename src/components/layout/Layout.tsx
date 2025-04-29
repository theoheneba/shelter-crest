import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import UserSidebar from './UserSidebar';
import AdminSidebar from './AdminSidebar';

const Layout = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1">
        {isAuthenticated && (
          <>
            {isAdmin ? (
              <AdminSidebar />
            ) : (
              <UserSidebar />
            )}
          </>
        )}
        
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${isAuthenticated ? 'lg:ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;