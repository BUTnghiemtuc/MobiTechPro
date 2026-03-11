import { AppDataSource } from "../../../config/data-source";
import { Review } from "../1models/reviews.entity";
import { Product } from "../../products/1models/products.entity";
import { User } from "../../users/1models/users.entity";

const reviewRepository = AppDataSource.getRepository(Review);
const productRepository = AppDataSource.getRepository(Product);

export class ReviewsService {
    static async createReview(userId: number, productId: number, rating: number, comment: string) {
        const product = await productRepository.findOneBy({ id: productId });
        if (!product) {
            throw new Error("Không tìm thấy sản phẩm");
        }

        const review = reviewRepository.create({
            rating,
            comment,
            user: { id: userId } as User,
            product: product
        });

        return await reviewRepository.save(review);
    }

    static async getReviewsByProduct(productId: number) {
        return await reviewRepository.find({
            where: { product: { id: productId } },
            relations: ["user"],
            order: { created_at: "DESC" }
        });
    }
}