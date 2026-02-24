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
exports.TagsController = void 0;
const tags_service_1 = require("./tags.service");
class TagsController {
    static getAllTags(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield tags_service_1.TagsService.getAllTags();
                res.json(tags);
            }
            catch (error) {
                console.error("Get all tags error:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static createTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, color } = req.body;
                // Assuming authMiddleware populates req.user
                if (!req.user) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                const userId = req.user.userId;
                if (!name) {
                    res.status(400).json({ message: "Name is required" });
                    return;
                }
                const tag = yield tags_service_1.TagsService.createTag(name, color, userId);
                res.status(201).json(tag);
            }
            catch (error) {
                console.error("Create tag error:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static assignTagToProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, tagId } = req.body;
                if (!productId || !tagId) {
                    res.status(400).json({ message: "Product ID and Tag ID are required" });
                    return;
                }
                yield tags_service_1.TagsService.assignTagToProduct(productId, tagId);
                res.status(200).json({ message: "Tag assigned to product successfully" });
            }
            catch (error) {
                console.error("Assign tag error:", error);
                res.status(400).json({ message: error.message || "Failed to assign tag" });
            }
        });
    }
    static removeTagFromProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, tagId } = req.body;
                if (!productId || !tagId) {
                    res.status(400).json({ message: "Product ID and Tag ID are required" });
                    return;
                }
                yield tags_service_1.TagsService.removeTagFromProduct(productId, tagId);
                res.status(200).json({ message: "Tag removed from product successfully" });
            }
            catch (error) {
                console.error("Remove tag error:", error);
                res.status(400).json({ message: error.message || "Failed to remove tag" });
            }
        });
    }
    static getTagStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield tags_service_1.TagsService.getTagStats();
                res.json(stats);
            }
            catch (error) {
                console.error("Get tag stats error:", error);
                res.status(500).json({ message: "Failed to get tag stats" });
            }
        });
    }
}
exports.TagsController = TagsController;
//# sourceMappingURL=tags.controller.js.map