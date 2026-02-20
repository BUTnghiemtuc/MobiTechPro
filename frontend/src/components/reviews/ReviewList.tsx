import { motion } from 'framer-motion';
import type { Review } from '../../services/review.service';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // 1-star to 5-star
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Đánh giá từ khách hàng</h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-3">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex justify-center text-yellow-500 text-2xl mb-2">
              {'★'.repeat(Math.round(avgRating))}
              {'☆'.repeat(5 - Math.round(avgRating))}
            </div>
            <p className="text-gray-600">{reviews.length} đánh giá</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingCounts[star - 1];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-gray-600 w-14 text-sm font-medium">{star} sao</span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-600 w-20 text-sm text-right">
                    {percentage.toFixed(0)}% ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{review.user?.username || 'Anonymous'}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-xs">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Verified Badge (if needed) */}
              <span className="text-green-600 text-xs bg-green-50 px-3 py-1 rounded-full border border-green-200">
                ✓ Verified
              </span>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            
            {/* Like/Dislike (placeholder for future) */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <button className="text-gray-500 hover:text-blue-600 transition-colors text-sm">
                Hữu ích
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors text-sm">
                Báo cáo
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
