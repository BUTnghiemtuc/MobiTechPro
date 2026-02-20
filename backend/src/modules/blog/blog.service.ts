import { AppDataSource } from '../../config/data-source';
import { BlogPost } from './blog.entity';
import { Like } from 'typeorm';

const blogRepository = AppDataSource.getRepository(BlogPost);

export class BlogService {
  // Public: Get all published posts
  static async findAll(page: number = 1, limit: number = 10, category?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { published: true };

    if (category && category !== 'Tất cả') {
      where.category = category;
    }

    if (search) {
      where.title = Like(`%${search}%`);
    }

    const [data, total] = await blogRepository.findAndCount({
      where,
      relations: ['author'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Admin: Get all posts including drafts
  static async findAllAdmin(page: number = 1, limit: number = 20, category?: string, published?: boolean, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (published !== undefined) {
      where.published = published;
    }

    if (search) {
      where.title = Like(`%${search}%`);
    }

    const [data, total] = await blogRepository.findAndCount({
      where,
      relations: ['author'],
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get single post by ID
  static async findOne(id: number) {
    return await blogRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  // Get post by slug
  static async findBySlug(slug: string) {
    return await blogRepository.findOne({
      where: { slug, published: true },
      relations: ['author'],
    });
  }

  // Create new post
  static async create(data: Partial<BlogPost>, userId: number) {
    const post = blogRepository.create({
      ...data,
      author_id: userId,
      slug: data.slug || this.generateSlug(data.title || ''),
      read_time: data.read_time || this.calculateReadTime(data.content || ''),
    });

    return await blogRepository.save(post);
  }

  // Update post
  static async update(id: number, data: Partial<BlogPost>) {
    const updateData: any = { ...data };
    
    if (data.title && !data.slug) {
      updateData.slug = this.generateSlug(data.title);
    }

    if (data.content && !data.read_time) {
      updateData.read_time = this.calculateReadTime(data.content);
    }

    await blogRepository.update(id, updateData);
    return await this.findOne(id);
  }

  // Delete post
  static async delete(id: number) {
    const result = await blogRepository.delete(id);
    return (result.affected || 0) > 0;
  }

  // Toggle publish status
  static async togglePublish(id: number) {
    const post = await this.findOne(id);
    if (!post) {
      throw new Error('Post not found');
    }

    post.published = !post.published;
    return await blogRepository.save(post);
  }

  // Helper: Generate slug from title
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // Helper: Calculate read time
  private static calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} phút đọc`;
  }
}
