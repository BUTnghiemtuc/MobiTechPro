import React from 'react';
import type { Review } from '../../services/review.service';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                {review.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{review.user?.username || 'Anonymous'}</h4>
                <div className="flex text-yellow-400 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>
            </div>
            <span className="text-gray-400 text-sm">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed mt-2">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
