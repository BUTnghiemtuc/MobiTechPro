import { AppDataSource } from "../../../config/data-source";
import { BlogPost } from "../1models/blog.entity";
import { User } from "../../users/1models/users.entity"; 
import { Like } from 'typeorm';

const blogRepository = AppDataSource.getRepository(BlogPost);

export class BlogService {
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

  static async findOne(id: number) {
    return await blogRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  static async findBySlug(slug: string) {
    return await blogRepository.findOne({
      where: { slug, published: true },
      relations: ['author'],
    });
  }

  static async create(data: any, userId: number) {
    const post = blogRepository.create({
      ...data,
      author: { id: userId } as User,
      slug: data.slug || this.generateSlug(data.title || ''),
      read_time: data.read_time || this.calculateReadTime(data.content || ''),
    });

    return await blogRepository.save(post);
  }

  static async update(id: number, data: any) {
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

  static async delete(id: number) {
    const result = await blogRepository.delete(id);
    return (result.affected || 0) > 0;
  }

  static async togglePublish(id: number) {
    const post = await this.findOne(id);
    if (!post) {
      throw new Error('Không tìm thấy bài viết');
    }

    post.published = !post.published;
    return await blogRepository.save(post);
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private static calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} phút đọc`;
  }
}