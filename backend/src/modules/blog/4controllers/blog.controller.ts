import { Response } from 'express';
import { BlogService } from '../2services/blog.service';

export class BlogController {
  static async getPublishedPosts(req: any, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const category = req.query.category;
      const search = req.query.search;

      const result = await BlogService.findAll(page, limit, category, search);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getPost(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      const post = await BlogService.findOne(id);
      
      if (!post) {
        return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      }
      
      return res.status(200).json(post);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getPostBySlug(req: any, res: Response) {
    try {
      const slug = req.params.slug;
      const post = await BlogService.findBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      }
      
      return res.status(200).json(post);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllPosts(req: any, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const category = req.query.category;
      const search = req.query.search;
      const publishedParam = req.query.published;
      const published = publishedParam === 'true' ? true : publishedParam === 'false' ? false : undefined;

      const result = await BlogService.findAllAdmin(page, limit, category, published, search);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async createPost(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const postData = { ...req.body };

      if (req.file) {
        postData.featured_image = req.file.path;
      }

      const post = await BlogService.create(postData, userId);
      return res.status(201).json(post);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async updatePost(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      const postData = { ...req.body };

      if (req.file) {
        postData.featured_image = req.file.path;
      }

      const post = await BlogService.update(id, postData);
      return res.status(200).json(post);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async deletePost(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      const success = await BlogService.delete(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Không tìm thấy bài viết để xóa' });
      }
      
      return res.status(200).json({ message: 'Xóa bài viết thành công' });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async togglePublish(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      const post = await BlogService.togglePublish(id);
      return res.status(200).json(post);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}