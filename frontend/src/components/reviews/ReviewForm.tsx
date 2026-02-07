import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { reviewService } from '../../services/review.service';
import { useAuth } from '../../context/AuthContext';
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
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
        <p className="text-gray-600 mb-2">Please log in to write a review.</p>
        <Link to="/login" className="text-primary-600 font-medium hover:underline">
          Login Now
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please enter a comment');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview({ productId, rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      onReviewAdded();
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-shadow"
            rows={4}
            placeholder="Share your thoughts about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Post Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
