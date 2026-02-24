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
exports.BrandsController = void 0;
const brands_service_1 = require("./brands.service");
class BrandsController {
    static getBrands(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const brands = yield brands_service_1.BrandsService.findAll();
                res.json(brands);
            }
            catch (error) {
                console.error('Get brands error:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    static getActiveBrands(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const brands = yield brands_service_1.BrandsService.findActive();
                res.json(brands);
            }
            catch (error) {
                console.error('Get active brands error:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    static getBrandById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
                const brand = yield brands_service_1.BrandsService.findOne(id);
                if (!brand) {
                    return res.status(404).json({ message: "Brand not found" });
                }
                res.json(brand);
            }
            catch (error) {
                console.error('Get brand by ID error:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    static createBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log('Create brand request:', { body: req.body, files: req.files });
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const brandData = {
                    name: req.body.name,
                    color: req.body.color || null,
                    bgGradient: req.body.bgGradient || null,
                    link: req.body.link || null,
                    displayOrder: parseInt(req.body.displayOrder) || 0,
                    isActive: req.body.isActive === 'true' || req.body.isActive === true,
                };
                // Handle file uploads
                if (req.files) {
                    const files = req.files;
                    if ((_a = files.logo) === null || _a === void 0 ? void 0 : _a[0]) {
                        brandData.logoUrl = files.logo[0].path; // Cloudinary URL
                    }
                    if ((_b = files.image) === null || _b === void 0 ? void 0 : _b[0]) {
                        brandData.imageUrl = files.image[0].path; // Cloudinary URL
                    }
                }
                console.log('Creating brand with data:', brandData);
                const brand = yield brands_service_1.BrandsService.create(brandData);
                res.status(201).json(brand);
            }
            catch (error) {
                console.error('Create brand error:', error);
                res.status(500).json({ message: error.message, stack: error.stack });
            }
        });
    }
    static updateBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
                const brandData = {
                    name: req.body.name,
                    color: req.body.color || null,
                    bgGradient: req.body.bgGradient || null,
                    link: req.body.link || null,
                    displayOrder: parseInt(req.body.displayOrder) || 0,
                    isActive: req.body.isActive === 'true' || req.body.isActive === true,
                };
                // Handle file uploads
                if (req.files) {
                    const files = req.files;
                    if ((_a = files.logo) === null || _a === void 0 ? void 0 : _a[0]) {
                        brandData.logoUrl = files.logo[0].path;
                    }
                    if ((_b = files.image) === null || _b === void 0 ? void 0 : _b[0]) {
                        brandData.imageUrl = files.image[0].path;
                    }
                }
                const brand = yield brands_service_1.BrandsService.update(id, brandData);
                if (!brand) {
                    return res.status(404).json({ message: "Brand not found" });
                }
                res.json(brand);
            }
            catch (error) {
                console.error('Update brand error:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
    static deleteBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
                yield brands_service_1.BrandsService.delete(id);
                res.status(204).send();
            }
            catch (error) {
                console.error('Delete brand error:', error);
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.BrandsController = BrandsController;
//# sourceMappingURL=brands.controller.js.map