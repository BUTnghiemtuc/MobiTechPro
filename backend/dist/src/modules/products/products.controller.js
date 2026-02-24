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
exports.ProductsController = void 0;
const products_service_1 = require("./products.service");
class ProductsController {
    static getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const title = req.query.title ? String(req.query.title) : undefined;
                const tag = req.query.tag ? String(req.query.tag) : undefined;
                const result = yield products_service_1.ProductsService.findAll(page, limit, title, tag);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const product = yield products_service_1.ProductsService.findOne(id);
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }
                res.json(product);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user)
                    return res.status(401).json({ message: "Unauthorized" });
                const productData = req.body;
                // Handle multiple images
                if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                    // Cloudinary middleware returns array of files with .path as full URL
                    productData.images = req.files.map((file) => file.path);
                    // Set first image as main image_url for backward compatibility
                    productData.image_url = req.files[0].path;
                }
                else if (req.file) {
                    // Single file upload (backward compatibility)
                    productData.image_url = req.file.path;
                    productData.images = [req.file.path];
                }
                const product = yield products_service_1.ProductsService.create(productData, req.user.userId);
                res.status(201).json(product);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const productData = req.body;
                // Handle multiple images
                if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                    productData.images = req.files.map((file) => file.path);
                    productData.image_url = req.files[0].path;
                }
                else if (req.file) {
                    // Single file upload (backward compatibility)
                    productData.image_url = req.file.path;
                    productData.images = [req.file.path];
                }
                const product = yield products_service_1.ProductsService.update(id, productData);
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }
                res.json(product);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield products_service_1.ProductsService.delete(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.ProductsController = ProductsController;
//# sourceMappingURL=products.controller.js.map