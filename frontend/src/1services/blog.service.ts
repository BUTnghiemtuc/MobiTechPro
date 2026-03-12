import api from './api';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image: string;
  author_id: number;
  author?: {
    id: number;
    username: string;
  };
  read_time: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogListResponse {
  data: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const blogService = {
  // Public: Get all published posts
  async getBlogPosts(page: number = 1, limit: number = 10, category?: string, search?: string): Promise<BlogListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
   
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const response = await api.get(`/blog?${params.toString()}`);
    return response.data;
  },

  // Public: Get single post
  async getBlogPost(id: number): Promise<BlogPost> {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },

  // Admin: Get all posts including drafts
  async getAllBlogPosts(page: number = 1, limit: number = 20, category?: string, published?: boolean, search?: string): Promise<BlogListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (category) params.append('category', category);
    if (published !== undefined) params.append('published', published.toString());
    if (search) params.append('search', search);

    const response = await api.get(`/admin/blog?${params.toString()}`);
    return response.data;
  },

  // Admin: Create new post
  async createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
    const response = await api.post('/admin/blog', data);
    return response.data;
  },

  // Admin: Update post
  async updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
    const response = await api.put(`/admin/blog/${id}`, data);
    return response.data;
  },

  // Admin: Delete post
  async deleteBlogPost(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/admin/blog/${id}`);
    return response.data;
  },

  // Admin: Toggle publish status
  async togglePublish(id: number): Promise<BlogPost> {
    const response = await api.patch(`/admin/blog/${id}/publish`);
    return response.data;
  },
};
