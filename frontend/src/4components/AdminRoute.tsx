import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner
  }

  // Check if user is logged in AND has Admin role only
  if (isAuthenticated && user?.role === 'Admin') {
    return <Outlet />;
  }

  // If authenticated but not Admin, show Access Denied
  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="mb-2 text-gray-700">You do not have permission to view this page.</p>
          <p className="mb-6 text-gray-600">
            Current Role: <span className="font-semibold">{user?.role || 'Unknown'}</span><br/>
            Required Role: <span className="font-semibold">Admin</span>
          </p>
          <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  // If not authorized, redirect to login
  return <Navigate to="/login" replace />;
};

export default AdminRoute;
