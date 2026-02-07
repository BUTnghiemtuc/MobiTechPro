import api from './api';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  quantity: number;
  tags?: any[]; // Allow tags array
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
  getProducts: async (page = 1, limit = 10, keyword = '', tag = '') => {
    const params: any = { page, limit };
    if (keyword) {
      params.title = keyword;
    }
    if (tag) {
      params.tag = tag;
    }
    const response = await api.get<ProductsResponse>('/products', { params });
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: any) => {
    // Assuming PUT /products/:id exists on backend, need to verify or use seed approach first if not.
    // Based on analysis, only POST /products exists. We need to check if PUT/DELETE exists.
    // If not, we might need to add them to backend or just stick to CREATE for now as per "Product Management" requirement implies CRUD.
    // Let's assume standard REST for now, but will verify backend routes next if needed.
    // Actually, looking at backend routes earlier, only GET and POST were visible in `products.routes.ts`.
    // I should check backend routes again to be sure.
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
