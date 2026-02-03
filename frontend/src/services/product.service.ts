import api from './api';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  // Add other fields if needed based on backend entity
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const productService = {
  getProducts: async (page = 1, limit = 10, keyword = '') => {
    const params: any = { page, limit };
    if (keyword) {
      params.title = keyword;
    }
    const response = await api.get<ProductsResponse>('/products', { params });
    return response.data;
  },
};
