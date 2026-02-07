
import { motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const NavLink = ({ to, children, className = "" }: { to: string, children: React.ReactNode, className?: string }) => {
  const location = useLocation();
  const isActive = (location.pathname + location.search) === to;

  return (
    <Link 
      to={to} 
      className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 hover:text-black ${
        isActive ? 'text-black font-semibold' : 'text-slate-500'
      } ${className}`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="navbar-underline"
          className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full"
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </Link>
  );
};

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  // Always use dark text for premium feel, unless on transparent hero if desired. 
  // But strictly, let's stick to clean visibility.
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${
        scrolled 
        ? 'glass-effect py-3 border-slate-200/50 shadow-sm' 
        : 'bg-white/90 backdrop-blur-md py-4' 
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-12 flex justify-between items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-black/20 group-hover:scale-105 transition-transform duration-300">
            M
          </div>
          <span className="text-xl font-display font-bold tracking-tighter text-slate-900 hidden sm:block">
            MobiTechPro
          </span>
        </Link>

        {/* Global Navigation (Mega Menu Style Trigger) */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/phones">Điện thoại</NavLink>
          <NavLink to="/?search=Accessories">Phụ kiện</NavLink>
          <NavLink to="/contact">Tư vấn</NavLink>
        </nav>

        {/* Search Bar - Premium Pill Shape */}
        <div className="hidden lg:flex flex-1 max-w-sm relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-none rounded-full leading-5 bg-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus:bg-slate-200 transition-all duration-300 sm:text-sm"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-black transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 rounded-full bg-black text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
               {/* User Profile Dropdown */}
               <div className="relative group/profile py-2">
                    <button className="flex items-center gap-3 focus:outline-none group-hover/profile:opacity-80 transition-opacity">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.username}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{user?.role === 'Admin' ? 'Administrator' : 'Member'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shadow-sm transition-transform group-active/profile:scale-95">
                             {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                                    {user?.username.charAt(0).toUpperCase()}
                                </div>
                             )}
                        </div>
                    </button>
                    
                    {/* Simplified Dropdown - Shows on hover of group/profile */}
                    <div className="absolute right-0 top-full w-48 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 transform origin-top-right mt-2">
                        <div className="flex flex-col gap-1">
                            <Link to="/profile" className="px-4 py-2.5 text-sm text-slate-700 hover:bg-black/5 hover:text-black rounded-xl transition-colors font-medium">My Profile</Link>
                            <Link to="/my-orders" className="px-4 py-2.5 text-sm text-slate-700 hover:bg-black/5 hover:text-black rounded-xl transition-colors font-medium">Order History</Link>
                            {(user?.role === 'Admin' || user?.role === 'Staff') && (
                                <Link to="/admin" className="px-4 py-2.5 text-sm text-slate-700 hover:bg-black/5 hover:text-black rounded-xl transition-colors font-medium">Admin Dashboard</Link>
                            )}
                            <div className="h-px bg-slate-100 my-1 mx-2"></div>
                            <button onClick={logout} className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors font-medium text-left">
                                Sign Out
                            </button>
                        </div>
                    </div>
               </div>

              {/* Shopping Bag Icon */}
              <Link to="/cart" className="relative group p-1">
                 <div className="p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                 </div>
                 <div className="absolute top-1 right-0 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm transform group-hover:scale-110 transition-transform">
                    2
                 </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
