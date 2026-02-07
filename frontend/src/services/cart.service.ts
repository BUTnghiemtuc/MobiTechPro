import api from './api';
import type { Product } from './product.service';

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
}

export const cartService = {
  addToCart: async (productId: number, quantity: number) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  getCart: async () => {
    const response = await api.get<CartItem[]>('/cart');
    return response.data;
  },

  checkout: async (address: string) => {
    const response = await api.post<Order>('/orders', { address });
    return response.data;
  },

  removeFromCart: async (cartItemId: number) => {
    return await api.delete(`/cart/${cartItemId}`);
  }
};      
