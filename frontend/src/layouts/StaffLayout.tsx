import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StaffLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-green-700' : 'hover:bg-green-600';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-green-700">
          Staff Panel
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <Link 
            to="/staff" 
            className={`block p-3 rounded transition-colors ${isActive('/staff')}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/staff/products" 
            className={`block p-3 rounded transition-colors ${isActive('/staff/products')}`}
          >
            Products
          </Link>
          <Link 
            to="/staff/orders" 
            className={`block p-3 rounded transition-colors ${isActive('/staff/orders')}`}
          >
            Orders
          </Link>
          <Link 
            to="/" 
            className="block p-3 rounded hover:bg-green-600 transition-colors mt-8 border-t border-green-700"
          >
            Back to Website
          </Link>
        </nav>

        <div className="p-4 border-t border-green-700">
          <div className="mb-2 text-sm text-green-200">
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
            {location.pathname === '/staff' ? 'Dashboard' : 
             location.pathname.includes('products') ? 'Product Management' : 
             location.pathname.includes('orders') ? 'Order Management' : 'Staff Area'}
          </h2>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
