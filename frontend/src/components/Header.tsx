
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

  // Customer Header - Default for non-authenticated or Customer role
  const CustomerNav = () => (
    <nav className="flex gap-4">
      <Link to="/" className="hover:text-gray-300">Home</Link>
      <Link to="/cart" className="hover:text-gray-300">Cart</Link>
      {isAuthenticated ? (
        <>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">Welcome, {user?.username}</span>
          <button onClick={logout} className="hover:text-gray-300">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
          <Link to="/register" className="hover:text-gray-300">Register</Link>
        </>
      )}
    </nav>
  );

  // Staff Header
  const StaffNav = () => (
    <nav className="flex gap-4">
      <Link to="/" className="hover:text-green-300">Home</Link>
      <Link to="/admin" className="hover:text-green-300">Dashboard</Link>
      <Link to="/admin/products" className="hover:text-green-300">Products</Link>
      <span className="text-gray-400">|</span>
      <span className="text-green-300">Staff: {user?.username}</span>
      <button onClick={logout} className="hover:text-green-300">Logout</button>
    </nav>
  );

  // Admin Header
  const AdminNav = () => (
    <nav className="flex gap-4">
      <Link to="/" className="hover:text-blue-300">Home</Link>
      <Link to="/admin" className="hover:text-blue-300">Admin Dashboard</Link>
      <Link to="/admin/products" className="hover:text-blue-300">Products</Link>
      <span className="text-gray-400">|</span>
      <span className="text-blue-300">Admin: {user?.username}</span>
      <button onClick={logout} className="hover:text-blue-300">Logout</button>
    </nav>
  );

  // Determine header style and navigation based on role
  const getHeaderStyle = () => {
    if (user?.role === 'Admin') return 'bg-blue-900 text-white';
    if (user?.role === 'Staff') return 'bg-green-900 text-white';
    return 'bg-gray-800 text-white';
  };

  const getNavigation = () => {
    if (user?.role === 'Admin') return <AdminNav />;
    if (user?.role === 'Staff') return <StaffNav />;
    return <CustomerNav />;
  };

  return (
    <header className={`${getHeaderStyle()} p-4 flex justify-between items-center shadow-lg`}>
      <div className="text-xl font-bold">
        <Link to="/">
          MobiTechPro {user?.role && `- ${user.role}`}
        </Link>
      </div>
      {getNavigation()}
    </header>
  );
};

export default Header;
