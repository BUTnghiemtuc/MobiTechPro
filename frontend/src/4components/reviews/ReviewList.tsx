import { motion } from 'framer-motion';
import type { Review } from '../../1services/review.service';
import styles from './ReviewList.module.css';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
      </div>
    );
  }

  // Tính toán phân bổ số lượng đánh giá từ 1 đến 5 sao
  const ratingCounts = [0, 0, 0, 0, 0]; 
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++;
    }
  });

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className={styles.container}>
      
      {/* --- Bảng Tóm Tắt Đánh Giá --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.summaryCard}
      >
        <h3 className={styles.summaryTitle}>Đánh giá từ khách hàng</h3>
        
        <div className={styles.summaryGrid}>
          {/* Cột trái: Điểm trung bình */}
          <div className={styles.avgScoreBox}>
            <div className={styles.avgScoreText}>
              {avgRating.toFixed(1)}
            </div>
            <div className={styles.starsContainer}>
              {'★'.repeat(Math.round(avgRating))}
              {'☆'.repeat(5 - Math.round(avgRating))}
            </div>
            <p className={styles.totalReviewsText}>{reviews.length} đánh giá</p>
          </div>

          {/* Cột phải: Thanh tiến trình phân bổ điểm */}
          <div className={styles.distributionBox}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingCounts[star - 1];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={star} className={styles.distRow}>
                  <span className={styles.distLabel}>{star} sao</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={styles.distPercent}>
                    {percentage.toFixed(0)}% ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* --- Danh sách từng bình luận --- */}
      <div className={styles.reviewList}>
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.reviewCard}
          >
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerInfo}>
                {/* Avatar người dùng */}
                <div className={styles.avatar}>
                  {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className={styles.reviewerName}>{review.user?.username || 'Khách hàng ẩn danh'}</h4>
                  <div className={styles.reviewMeta}>
                    <div className={styles.reviewStars}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Huy hiệu đã xác minh */}
              <span className={styles.verifiedBadge}>
                ✓ Đã mua hàng
              </span>
            </div>
            
            <p className={styles.commentText}>{review.comment}</p>
            
            {/* Nút thao tác phụ (Tương lai phát triển thêm) */}
            <div className={styles.actionsBox}>
              <button className={styles.actionBtn}>Hữu ích</button>
              <button className={`${styles.actionBtn} ${styles.reportBtn}`}>Báo cáo</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;