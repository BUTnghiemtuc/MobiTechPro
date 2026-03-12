import api from './api';

export interface Brand {
  id: number;
  name: string;
  color?: string;
  bgGradient?: string;
  logoUrl?: string;
  imageUrl?: string;
  link?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
