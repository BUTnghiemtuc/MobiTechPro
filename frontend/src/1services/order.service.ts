import api from './api';

export const OrderStatus = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface OrderItem {
  id: number;
  product: {
    id: number;
    title: string;
    image_url?: string;
  };
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: number;
  total_price: number;
  status: OrderStatus;
  address: string;
  created_at: string;
  orderItems: OrderItem[];
  user?: {
    username: string;
  };
}

export const orderService = {
  createOrder: async (address: string) => {
    return api.post<Order>('/orders', { address }).then(res => res.data);
  },

  getMyOrders: async () => {
    return api.get<Order[]>('/orders/my-orders').then(res => res.data);
  },

  getAllOrders: async () => {
    return api.get<Order[]>('/orders/admin').then(res => res.data);
  },

  updateStatus: async (id: number, status: OrderStatus) => {
    return api.patch<Order>(`/orders/${id}/status`, { status }).then(res => res.data);
  },

  deleteOrder: async (id: number) => {
    return api.delete(`/orders/${id}`);
  },

  getDashboardStats: async () => {
    return api.get<{
        revenue: number;
        totalOrders: number;
        totalProducts: number;
        statusDistribution: { name: string; count: number; color: string }[];
        revenueTrend: { name: string; revenue: number }[];
    }>('/orders/stats').then(res => res.data);
  }
};
