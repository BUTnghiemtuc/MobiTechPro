import { useMemo } from 'react';
import styles from './ShippingProgressBar.module.css';

interface ShippingProgressBarProps {
  subtotal: number;
  freeShippingThreshold?: number;
}

// Giả sử mốc freeship mặc định là 500.000đ cho nó thực tế ở VN nhé anh
const ShippingProgressBar = ({ subtotal, freeShippingThreshold = 500000 }: ShippingProgressBarProps) => {
  const progress = useMemo(() => {
    return Math.min((subtotal / freeShippingThreshold) * 100, 100);
  }, [subtotal, freeShippingThreshold]);

  const remaining = freeShippingThreshold - subtotal;
  const isEligible = subtotal >= freeShippingThreshold;

  // Hàm format tiền tệ (Ví dụ: 100000 -> 100.000đ)
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className={styles.container}>
      {isEligible ? (
        <div className={styles.successMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.successIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>🎉 Chúc mừng! Bạn được Miễn Phí Vận Chuyển</span>
        </div>
      ) : (
        <div className={styles.pendingContainer}>
          <div className={styles.pendingRow}>
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.pendingIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span className={styles.pendingText}>
              Mua thêm <span className={styles.amountHighlight}>{formatCurrency(remaining)}</span> để được Miễn Phí Vận Chuyển
            </span>
          </div>
        </div>
      )}
      
      {/* Thanh Tiến Trình */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressTrack}>
          <div
            className={`${styles.progressFill} ${isEligible ? styles.fillEligible : styles.fillPending}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={styles.progressLabel}>
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default ShippingProgressBar;