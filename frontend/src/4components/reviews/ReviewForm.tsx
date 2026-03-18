import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { reviewService } from '../../1services/review.service';
import { useAuth } from '../../2context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
  productId: number;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewAdded }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Giao diện khi chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${styles.card} ${styles.unauthWrapper}`}
      >
        <p className={styles.unauthMessage}>Đăng nhập để viết đánh giá</p>
        <Link to="/login" className={styles.loginBtn}>
          Đăng nhập ngay
        </Link>
      </motion.div>
    );
  }

  // Xử lý gửi form
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
      onReviewAdded(); // Trigger load lại danh sách review
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      toast.error('Gửi đánh giá thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.card}
    >
      <h3 className={styles.formTitle}>Viết đánh giá</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Khối chọn Sao (Rating) */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Đánh giá của bạn</label>
          <div className={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`${styles.starBtn} ${star <= rating ? styles.starActive : styles.starInactive}`}
              >
                ★
              </button>
            ))}
          </div>
          <p className={styles.ratingFeedback}>
            {rating === 5 && 'Xuất sắc!'}
            {rating === 4 && 'Rất tốt!'}
            {rating === 3 && 'Tốt'}
            {rating === 2 && 'Trung bình'}
            {rating === 1 && 'Kém'}
          </p>
        </div>
        
        {/* Khối nhập bình luận (Comment) */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nhận xét</label>
          <textarea
            className={styles.textarea}
            rows={5}
            maxLength={500} // Ép giới hạn số chữ HTML
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className={styles.charCount}>
            {comment.length}/500 ký tự
          </div>
        </div>

        {/* Nút Gửi */}
        <button
          type="submit"
          disabled={submitting}
          className={styles.submitBtn}
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;