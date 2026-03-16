import api from './api';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  avatar_url: string;
  role: string;
}

export const userService = {
  getProfile: async () => {
    return api.get<UserProfile>('/users/profile').then(res => res.data);
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    return api.put<UserProfile>('/users/profile', data).then(res => res.data);
  },

  // Đổi mật khẩu
  changePassword: async (passwordData: any) => {
    return api.put('/users/change-password', passwordData).then(res => res.data);
  }
};