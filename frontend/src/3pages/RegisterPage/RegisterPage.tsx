import React, { useState } from 'react';
import { useAuth } from '../../2context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginBg from '../../assets/login.png';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await register(username, password, email);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
        
        {/* Left Side: Welcome Text */}
        <div className={styles.div_5}>
            <h1 className={styles.h1_1}>Join <br/> <span className="text-blue-400">MobiTechPro</span></h1>
            <p className={styles.p_1}>
                Create an account to unlock exclusive features, track your orders in real-time, and get personalized recommendations.
            </p>
        </div>

        {/* Right Side: Glassmorphism Form */}
        <div className={styles.div_6}>
            <div className={styles.div_7}>
                <div className={styles.div_8}>
                  <h2 className={styles.h2_1}>
                    Create Account
                  </h2>
                  <p className={styles.p_2}>
                    Already a member?{' '}
                    <Link to="/login" className={styles.Link_1}>
                      Sign In
                    </Link>
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="username" className={styles.label_1}>Username</label>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className={styles.input_1}
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={styles.label_1}>Email address</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className={styles.input_1}
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                     <div>
                      <label htmlFor="confirmPassword" className={styles.label_1}>Confirm Password</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className={styles.input_1}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                      {isLoading ? 'Creating account...' : 'Sign up'}
                    </button>
                  </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
