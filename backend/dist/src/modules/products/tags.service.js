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
exports.TagsService = void 0;
const data_source_1 = require("../../config/data-source");
const tags_entity_1 = require("./tags.entity");
const products_entity_1 = require("./products.entity");
const users_entity_1 = require("../users/users.entity");
class TagsService {
    static getAllTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tagRepository = data_source_1.AppDataSource.getRepository(tags_entity_1.Tag);
            return yield tagRepository.find({ order: { name: 'ASC' } });
        });
    }
    static createTag(name, color, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tagRepository = data_source_1.AppDataSource.getRepository(tags_entity_1.Tag);
            const tag = new tags_entity_1.Tag();
            tag.name = name;
            tag.color = color;
            // Link to user who created it
            const user = new users_entity_1.User();
            user.id = userId;
            tag.user = user;
            return yield tagRepository.save(tag);
        });
    }
    static assignTagToProduct(productId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepository = data_source_1.AppDataSource.getRepository(products_entity_1.Product);
            const tagRepository = data_source_1.AppDataSource.getRepository(tags_entity_1.Tag);
            const product = yield productRepository.findOne({
                where: { id: productId },
                relations: ["tags"]
            });
            if (!product) {
                throw new Error("Product not found");
            }
            const tag = yield tagRepository.findOneBy({ id: tagId });
            if (!tag) {
                throw new Error("Tag not found");
            }
            // Check for duplicates
            const exists = product.tags.some(t => t.id === tag.id);
            if (exists) {
                // Already assigned, just return or throw error. 
                // User requirement: "Kiểm tra xem cặp product_id và tag_id đã tồn tại chưa"
                // Returning ensures idempotency without error.
                return;
            }
            product.tags.push(tag);
            yield productRepository.save(product);
        });
    }
    static removeTagFromProduct(productId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRepository = data_source_1.AppDataSource.getRepository(products_entity_1.Product);
            const product = yield productRepository.findOne({
                where: { id: productId },
                relations: ["tags"]
            });
            if (!product) {
                throw new Error("Product not found");
            }
            // Filter out the tag to be removed
            product.tags = product.tags.filter(t => t.id !== Number(tagId));
            yield productRepository.save(product);
        });
    }
    static getTagStats() {
        return __awaiter(this, void 0, void 0, function* () {
            // Query to count products per tag
            const tagRepository = data_source_1.AppDataSource.getRepository(tags_entity_1.Tag);
            // Use QueryBuilder for complex aggregation
            return yield tagRepository.createQueryBuilder("tag")
                .leftJoin("tag.products", "product")
                .select([
                "tag.id AS id",
                "tag.name AS name",
                "tag.color AS color",
                "COUNT(product.id) AS productCount"
            ])
                .groupBy("tag.id")
                .addGroupBy("tag.name")
                .addGroupBy("tag.color")
                .getRawMany();
        });
    }
}
exports.TagsService = TagsService;
//# sourceMappingURL=tags.service.js.map