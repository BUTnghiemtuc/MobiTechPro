import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../1services/api';
import { useAuth } from './AuthContext';

// Định nghĩa khung xương dữ liệu của 1 món hàng trong giỏ
export interface CartItem {
  id: number;
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  featured_image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { isAuthenticated } = useAuth(); // Kéo trạng thái đăng nhập từ AuthContext sang

  // Tự động tính tổng số lượng món hàng và tổng tiền
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Gọi API lấy dữ liệu giỏ hàng từ Backend
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      // Gọi đúng đường dẫn API giỏ hàng ở Backend anh em mình đã làm
      const response = await api.get('/cart'); 
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
    }
  };

  // Tự động tải giỏ hàng ngay khi người dùng đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]); // Quét sạch giỏ hàng trên UI nếu đăng xuất
    }
  }, [isAuthenticated]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      await api.post('/cart', { productId, quantity });
      await fetchCart(); // Thêm xong thì tải lại giỏ hàng cho số nó nhảy
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ:', error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await api.patch(`/cart/items/${cartItemId}`, { quantity });
      await fetchCart();
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await api.delete(`/cart/items/${cartItemId}`);
      await fetchCart();
    } catch (error) {
      console.error('Lỗi khi xóa món hàng:', error);
      throw error;
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, totalQuantity, totalPrice, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart bắt buộc phải nằm bên trong CartProvider');
  }
  return context;
};