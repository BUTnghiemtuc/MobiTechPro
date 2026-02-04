import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : 'hover:bg-blue-600';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-blue-700">
          {user?.role === 'Admin' ? 'Admin Panel' : 'Staff Panel'}
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <Link 
            to="/admin" 
            className={`block p-3 rounded transition-colors ${isActive('/admin')}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className={`block p-3 rounded transition-colors ${isActive('/admin/products')}`}
          >
            Products
          </Link>
          <Link 
            to="/admin/orders" 
            className={`block p-3 rounded transition-colors ${isActive('/admin/orders')}`}
          >
            Orders
          </Link>
          
          {/* Admin-only menu items */}
          {user?.role === 'Admin' && (
            <>
              <Link 
                to="/admin/users" 
                className={`block p-3 rounded transition-colors ${isActive('/admin/users')}`}
              >
                Users Management
              </Link>
              <Link 
                to="/admin/stats" 
                className={`block p-3 rounded transition-colors ${isActive('/admin/stats')}`}
              >
                Revenue Stats
              </Link>
            </>
          )}
          
          <Link 
            to="/" 
            className="block p-3 rounded hover:bg-blue-600 transition-colors mt-8 border-t border-blue-700"
          >
            Back to Website
          </Link>
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="mb-2 text-sm text-blue-200">
            Logged in as: <br />
            <span className="font-bold text-white">{user?.username}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname === '/admin' ? 'Dashboard' : 
             location.pathname.includes('products') ? 'Product Management' : 
             location.pathname.includes('orders') ? 'Order Management' : 'Admin Area'}
          </h2>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
