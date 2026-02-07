import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

// Define types broadly for now, can be refined based on backend response
interface User {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  role: 'Customer' | 'Staff' | 'Admin'; // Explicitly define roles
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state for initial check

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user'); // Optional: check if we persist user info too
    
    if (token) {
      setIsAuthenticated(true);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse saved user", e);
        }
      }
      // Optional: Verify token with backend here if needed
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      // Assuming response.data contains { accessToken: string, user: User }
      // Adjust based on your actual API response structure
      const { token, user } = response.data; 

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to let components handle UI error feedback
    }
  };

  const register = async (username: string, password: string, email: string) => {
    try {
      await api.post('/auth/register', { username, password, email });
      // After register, user might need to login, or is auto-logged in.
      // For now, assume we just redirect to login logic or let user login.
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    // Redirect to login is usually handled by the component calling logout or by a ProtectedRoute
    // reacting to isAuthenticated = false. 
    // To forcibly redirect here would require useNavigate or window.location
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
