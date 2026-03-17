import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { reviewService } from '../../1services/review.service';
import { useAuth } from '../../2context/AuthContext';
import { Link } from 'react-router-dom';

interface ReviewFormProps {
  productId: number;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg text-center"
      >
        <p className="text-gray-700 mb-4 text-lg font-semibold">Đăng nhập để viết đánh giá</p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all"
        >
          Đăng nhập ngay
        </Link>
      </motion.div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview({ productId, rating, comment });
      toast.success('Đánh giá thành công!');
      setComment('');
      setRating(5);
      onReviewAdded();
    } catch (error) {
      console.error(error);
      toast.error('Gửi đánh giá thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Viết đánh giá
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Đánh giá của bạn
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl bg-transparent border-none p-0 leading-none transition-all hover:scale-110 focus:outline-none ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-2 font-medium">
            {rating === 5 && 'Xuất sắc!'}
            {rating === 4 && 'Rất tốt!'}
            {rating === 3 && 'Tốt'}
            {rating === 2 && 'Trung bình'}
            {rating === 1 && 'Kém'}
          </p>
        </div>
        
        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Nhận xét
          </label>
          <textarea
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            rows={5}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="text-xs text-gray-500 mt-2">
            {comment.length}/500 ký tự
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
