import { Response } from "express";
import { ReviewsService } from "../2services/reviews.service";

export class ReviewsController {
    static async create(req: any, res: Response) {
        try {
            const userId = req.user.id; 
            const { productId, rating, comment } = req.body;

            if (!productId || !rating || !comment) {
                 return res.status(400).json({ message: "Vui lòng nhập đủ thông tin đánh giá" });
            }

            const review = await ReviewsService.createReview(userId, productId, rating, comment);
            return res.status(201).json(review);
        } catch (error: any) {
            console.error("Lỗi khi tạo đánh giá:", error);
            return res.status(500).json({ message: error.message });
        }
    }

    static async getByProduct(req: any, res: Response) {
        try {
            const productId = Number(req.params.productId);
            const reviews = await ReviewsService.getReviewsByProduct(productId);
            return res.status(200).json(reviews);
        } catch (error: any) {
             return res.status(500).json({ message: error.message });
        }
    }
}