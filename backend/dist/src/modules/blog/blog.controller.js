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
exports.BlogController = void 0;
const blog_service_1 = require("./blog.service");
class BlogController {
    // Public: Get all published posts
    static getPublishedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const category = req.query.category;
                const search = req.query.search;
                const result = yield blog_service_1.BlogService.findAll(page, limit, category, search);
                return res.json(result);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to fetch blog posts', error });
            }
        });
    }
    // Public: Get single post by ID
    static getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const post = yield blog_service_1.BlogService.findOne(id);
                if (!post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                return res.json(post);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to fetch post', error });
            }
        });
    }
    // Public: Get post by slug
    static getPostBySlug(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = req.params.slug;
                const post = yield blog_service_1.BlogService.findBySlug(slug);
                if (!post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                return res.json(post);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to fetch post', error });
            }
        });
    }
    // Admin: Get all posts including drafts
    static getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const category = req.query.category;
                const search = req.query.search;
                const publishedParam = req.query.published;
                const published = publishedParam === 'true' ? true : publishedParam === 'false' ? false : undefined;
                const result = yield blog_service_1.BlogService.findAllAdmin(page, limit, category, published, search);
                return res.json(result);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to fetch blog posts', error });
            }
        });
    }
    // Admin: Create new post
    static createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const post = yield blog_service_1.BlogService.create(req.body, userId);
                return res.status(201).json(post);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to create post', error });
            }
        });
    }
    // Admin: Update post
    static updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const post = yield blog_service_1.BlogService.update(id, req.body);
                return res.json(post);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to update post', error });
            }
        });
    }
    // Admin: Delete post
    static deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield blog_service_1.BlogService.delete(id);
                if (!success) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                return res.json({ success: true, message: 'Post deleted successfully' });
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to delete post', error });
            }
        });
    }
    // Admin: Toggle publish status
    static togglePublish(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const post = yield blog_service_1.BlogService.togglePublish(id);
                return res.json(post);
            }
            catch (error) {
                return res.status(500).json({ message: 'Failed to toggle publish status', error });
            }
        });
    }
}
exports.BlogController = BlogController;
//# sourceMappingURL=blog.controller.js.map