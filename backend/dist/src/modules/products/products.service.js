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
exports.ProductsService = void 0;
const data_source_1 = require("../../config/data-source");
const products_entity_1 = require("./products.entity");
const productRepository = data_source_1.AppDataSource.getRepository(products_entity_1.Product);
class ProductsService {
    static findAll() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, title, tagName) {
            const skip = (page - 1) * limit;
            // Start building the query builder
            const queryBuilder = productRepository.createQueryBuilder("product")
                .leftJoinAndSelect("product.tags", "tag") // Load tags relation
                .orderBy("product.created_at", "DESC")
                .skip(skip)
                .take(limit);
            if (title) {
                queryBuilder.andWhere("(LOWER(product.title) LIKE LOWER(:title) OR LOWER(tag.name) LIKE LOWER(:title))", { title: `%${title}%` });
            }
            if (tagName) {
                queryBuilder.andWhere("tag.name = :tagName", { tagName });
            }
            const [products, total] = yield queryBuilder.getManyAndCount();
            return {
                data: products,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        });
    }
    static create(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = productRepository.create(Object.assign(Object.assign({}, data), { user: { id: userId } }));
            return yield productRepository.save(product);
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield productRepository.update(id, data);
            return yield productRepository.findOneBy({ id });
        });
    }
    static findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield productRepository.findOne({ where: { id }, relations: ["tags"] });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield productRepository.delete(id);
        });
    }
}
exports.ProductsService = ProductsService;
//# sourceMappingURL=products.service.js.map