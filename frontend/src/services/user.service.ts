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
    return api.get<UserProfile>('/users/me').then(res => res.data);
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    return api.put<UserProfile>('/users/me', data).then(res => res.data);
  },

  changePassword: async (passwordData: any) => {
    return api.put('/users/me/password', passwordData).then(res => res.data);
  }
};
