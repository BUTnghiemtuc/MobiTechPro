import { Request, Response } from "express";
import { ReviewsService } from "./reviews.service";

const reviewsService = new ReviewsService();

export class ReviewsController {
    async create(req: Request, res: Response) {
        try {
            // @ts-ignore
            const userId = req.user.userId; // JWT payload key is userId
            const { productId, rating, comment } = req.body;

            if (!productId || !rating || !comment) {
                 return res.status(400).json({ message: "Missing required fields" });
            }

            const review = await reviewsService.createReview(userId, productId, rating, comment);
            return res.status(201).json(review);
        } catch (error: any) {
            console.error("Error creating review:", error); // Add logging
            return res.status(500).json({ message: error.message });
        }
    }

    async getByProduct(req: Request, res: Response) {
        try {
            const productId = parseInt(req.params.productId as string);
            const reviews = await reviewsService.getReviewsByProduct(productId);
            return res.status(200).json(reviews);
        } catch (error: any) {
             return res.status(500).json({ message: error.message });
        }
    }
}
