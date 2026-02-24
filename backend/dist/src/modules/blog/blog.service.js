"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const data_source_1 = require("../../config/data-source");
const blog_entity_1 = require("./blog.entity");
const typeorm_1 = require("typeorm");
const blogRepository = data_source_1.AppDataSource.getRepository(blog_entity_1.BlogPost);
class BlogService {
    // Public: Get all published posts
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, category, search) {
            const skip = (page - 1) * limit;
            const where = { published: true };
            if (category && category !== 'Tất cả') {
                where.category = category;
            }
            if (search) {
                where.title = (0, typeorm_1.Like)(`%${search}%`);
            }
            const [data, total] = yield blogRepository.findAndCount({
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
        });
    }
    // Admin: Get all posts including drafts
    static findAllAdmin() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 20, category, published, search) {
            const skip = (page - 1) * limit;
            const where = {};
            if (category && category !== 'all') {
                where.category = category;
            }
            if (published !== undefined) {
                where.published = published;
            }
            if (search) {
                where.title = (0, typeorm_1.Like)(`%${search}%`);
            }
            const [data, total] = yield blogRepository.findAndCount({
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
        });
    }
    // Get single post by ID
    static findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository.findOne({
                where: { id },
                relations: ['author'],
            });
        });
    }
    // Get post by slug
    static findBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogRepository.findOne({
                where: { slug, published: true },
                relations: ['author'],
            });
        });
    }
    // Create new post
    static create(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = blogRepository.create(Object.assign(Object.assign({}, data), { author_id: userId, slug: data.slug || this.generateSlug(data.title || ''), read_time: data.read_time || this.calculateReadTime(data.content || '') }));
            return yield blogRepository.save(post);
        });
    }
    // Update post
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign({}, data);
            if (data.title && !data.slug) {
                updateData.slug = this.generateSlug(data.title);
            }
            if (data.content && !data.read_time) {
                updateData.read_time = this.calculateReadTime(data.content);
            }
            yield blogRepository.update(id, updateData);
            return yield this.findOne(id);
        });
    }
    // Delete post
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield blogRepository.delete(id);
            return (result.affected || 0) > 0;
        });
    }
    // Toggle publish status
    static togglePublish(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.findOne(id);
            if (!post) {
                throw new Error('Post not found');
            }
            post.published = !post.published;
            return yield blogRepository.save(post);
        });
    }
    // Helper: Generate slug from title
    static generateSlug(title) {
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
    static calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} phút đọc`;
    }
}
exports.BlogService = BlogService;
//# sourceMappingURL=blog.service.js.map