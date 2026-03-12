import api from './api';

export interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        id: number;
        username: string;
    };
}

export interface CreateReviewData {
    productId: number;
    rating: number;
    comment: string;
}

export const reviewService = {
    async getReviewsByProduct(productId: number | string) {
        // GET /api/reviews/:productId
        return api.get<Review[]>(`/reviews/${productId}`).then(res => res.data);
    },

    async createReview(data: CreateReviewData) {
        // POST /api/reviews
        return api.post<Review>('/reviews', data).then(res => res.data);
    }
};
