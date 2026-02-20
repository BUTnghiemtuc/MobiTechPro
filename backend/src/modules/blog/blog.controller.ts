import { Request, Response } from 'express';
import { BlogService } from './blog.service';

export class BlogController {
  // Public: Get all published posts
  static async getPublishedPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const search = req.query.search as string;

      const result = await BlogService.findAll(page, limit, category, search);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch blog posts', error });
    }
  }

  // Public: Get single post by ID
  static async getPost(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const post = await BlogService.findOne(id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch post', error });
    }
  }

  // Public: Get post by slug
  static async getPostBySlug(req: Request, res: Response) {
    try {
      const slug = req.params.slug;
      const post = await BlogService.findBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch post', error });
    }
  }

  // Admin: Get all posts including drafts
  static async getAllPosts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string;
      const search = req.query.search as string;
      const publishedParam = req.query.published as string;
      const published = publishedParam === 'true' ? true : publishedParam === 'false' ? false : undefined;

      const result = await BlogService.findAllAdmin(page, limit, category, published, search);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch blog posts', error });
    }
  }

  // Admin: Create new post
  static async createPost(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const post = await BlogService.create(req.body, userId);
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create post', error });
    }
  }

  // Admin: Update post
  static async updatePost(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const post = await BlogService.update(id, req.body);
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update post', error });
    }
  }

  // Admin: Delete post
  static async deletePost(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const success = await BlogService.delete(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Post not found' });
      }
      
      return res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete post', error });
    }
  }

  // Admin: Toggle publish status
  static async togglePublish(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const post = await BlogService.togglePublish(id);
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to toggle publish status', error });
    }
  }
}
