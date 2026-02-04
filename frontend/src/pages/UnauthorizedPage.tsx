import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-2">
          Bạn không có quyền truy cập trang này.
        </p>
        
        {user && (
          <p className="text-sm text-gray-500 mb-6">
            Current Role: <span className="font-semibold text-gray-700">{user.role}</span>
          </p>
        )}
        
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Go to Home
          </Link>
          <Link
            to={user?.role === 'Admin' ? '/admin' : user?.role === 'Staff' ? '/staff' : '/'}
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
          >
            {user?.role === 'Admin' && 'Go to Admin Dashboard'}
            {user?.role === 'Staff' && 'Go to Staff Dashboard'}
            {user?.role === 'Customer' && 'Continue Shopping'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
