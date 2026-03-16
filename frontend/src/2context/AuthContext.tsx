import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../1services/api';

export interface User {
  id: number; 
  username: string;
  email?: string;
  avatar_url?: string;
  role: 'customer' | 'staff' | 'admin'; 
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
  const [loading, setLoading] = useState<boolean>(true); 

  // Kiểm tra vé (token) mỗi khi load lại trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user'); 
    
    // Phải có cả token và user thì mới tính là đã đăng nhập
    if (token && savedUser) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Lỗi khi đọc thông tin user từ máy", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      
      // Hứng token và thông tin user từ Backend trả về
      const { token, user } = response.data; 

      // Lưu vào két sắt của trình duyệt (localStorage)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      throw error; 
    }
  };

  const register = async (username: string, password: string, email: string) => {
    try {
      // Đẩy data lên Backend theo đúng thứ tự
      await api.post('/auth/register', { username, email, password });
    } catch (error) {
      console.error('Đăng ký thất bại:', error);
      throw error;
    }
  };

  const logout = () => {
    // Quét sạch két sắt
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    // Đá về trang login
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
    throw new Error('useAuth bắt buộc phải nằm bên trong AuthProvider');
  }
  return context;
};