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
exports.ReviewsService = void 0;
const data_source_1 = require("../../config/data-source");
const reviews_entity_1 = require("./reviews.entity");
const products_entity_1 = require("../products/products.entity");
class ReviewsService {
    constructor() {
        this.reviewRepository = data_source_1.AppDataSource.getRepository(reviews_entity_1.Review);
        this.productRepository = data_source_1.AppDataSource.getRepository(products_entity_1.Product);
    }
    createReview(userId, productId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.productRepository.findOneBy({ id: productId });
            if (!product) {
                throw new Error("Product not found");
            }
            const review = new reviews_entity_1.Review();
            review.rating = rating;
            review.comment = comment;
            review.user = { id: userId };
            review.product = product;
            return yield this.reviewRepository.save(review);
        });
    }
    getReviewsByProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reviewRepository.find({
                where: { product: { id: productId } },
                relations: ["user"],
                order: { createdAt: "DESC" }
            });
        });
    }
}
exports.ReviewsService = ReviewsService;
//# sourceMappingURL=reviews.service.js.map