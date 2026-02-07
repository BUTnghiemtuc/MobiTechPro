import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginBg from '../assets/login.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
      toast.success('Login successful!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center lg:justify-end overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={loginBg} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Side: Welcome Text (Hidden on mobile key info, visible on large) */}
        <div className="hidden lg:block text-white max-w-lg">
            <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome to <br/> <span className="text-blue-400">MobiTechPro</span></h1>
            <p className="text-xl text-slate-200 opacity-90">
                Experience the next generation of e-commerce management. Track, analyze, and grow your business in style.
            </p>
        </div>

        {/* Right Side: Glassmorphism Form */}
        <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 sm:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    Sign In
                  </h2>
                  <p className="mt-2 text-sm text-slate-300">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                      Register now
                    </Link>
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-slate-200 mb-1">Username</label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white/10"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-1">Password</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:bg-white/10"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isLoading ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                      }`}
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
