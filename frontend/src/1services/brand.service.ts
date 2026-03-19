import api from './api';

export interface Brand {
  id: number;
  name: string;
  color?: string;
  bgGradient?: string;
  bg_gradient?: string;
  logoUrl?: string;
  logo_url?: string;
  imageUrl?: string;
  image_url?: string;
  link?: string;
  displayOrder: number;
  display_order?: number;
  isActive: boolean;
  is_active?: boolean;
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
}

export const brandService = {
  async getBrands(): Promise<Brand[]> {
    const response = await api.get('/brands');
    return response.data;
  },

  async getActiveBrands(): Promise<Brand[]> {
    const response = await api.get('/brands/active');
    return response.data;
  },

  async getBrand(id: number): Promise<Brand> {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  async createBrand(formData: FormData): Promise<Brand> {
    const response = await api.post('/brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateBrand(id: number, formData: FormData): Promise<Brand> {
    const response = await api.put(`/brands/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteBrand(id: number): Promise<void> {
    await api.delete(`/brands/${id}`);
  },
};
