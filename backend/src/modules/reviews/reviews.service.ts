import { AppDataSource } from "../../config/data-source";
import { Review } from "./reviews.entity";
import { Product } from "../products/products.entity";
import { User } from "../users/users.entity";

export class ReviewsService {
    private reviewRepository = AppDataSource.getRepository(Review);
    private productRepository = AppDataSource.getRepository(Product);

    async createReview(userId: number, productId: number, rating: number, comment: string) {
        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) {
            throw new Error("Product not found");
        }

        const review = new Review();
        review.rating = rating;
        review.comment = comment;
        review.user = { id: userId } as User;
        review.product = product;

        return await this.reviewRepository.save(review);
    }

    async getReviewsByProduct(productId: number) {
        return await this.reviewRepository.find({
            where: { product: { id: productId } },
            relations: ["user"],
            order: { createdAt: "DESC" }
        });
    }
}
