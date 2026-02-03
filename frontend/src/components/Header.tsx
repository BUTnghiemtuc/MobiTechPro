
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">MobiTechPro</Link>
      </div>
      <nav className="flex gap-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/cart" className="hover:text-gray-300">Cart</Link>
        {isAuthenticated ? (
          <button onClick={logout} className="hover:text-gray-300">Logout</button>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/register" className="hover:text-gray-300">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
