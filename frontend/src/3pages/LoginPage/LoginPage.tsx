import React, { useState } from 'react';
import { useAuth } from '../../2context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginBg from '../../assets/login.png';
import styles from './LoginPage.module.css';

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
    <div className={styles.div_1}>
      {/* Background Image & Overlay */}
      <div className={styles.div_2}>
        <img 
          src={loginBg} 
          alt="Background" 
          className={styles.img_1}
        />
        <div className={styles.div_3} />
      </div>

      {/* Content Container */}
      <div className={styles.div_4}>
        
        {/* Left Side: Welcome Text (Hidden on mobile key info, visible on large) */}
        <div className={styles.div_5}>
            <h1 className={styles.h1_1}>Welcome to <br/> <span className="text-blue-400">MobiTechPro</span></h1>
            <p className={styles.p_1}>
                Experience the next generation of e-commerce management. Track, analyze, and grow your business in style.
            </p>
        </div>

        {/* Right Side: Glassmorphism Form */}
        <div className={styles.div_6}>
            <div className={styles.div_7}>
                <div className={styles.div_8}>
                  <h2 className={styles.h2_1}>
                    Sign In
                  </h2>
                  <p className={styles.p_2}>
                    Don't have an account?{' '}
                    <Link to="/register" className={styles.Link_1}>
                      Register now
                    </Link>
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className={styles.label_1}>Username</label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className={styles.input_1}
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className={styles.label_1}>Password</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className={styles.input_1}
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
