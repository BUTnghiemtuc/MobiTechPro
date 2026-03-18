import { useState } from 'react';
import styles from './QuantityStepper.module.css';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void | Promise<void>; 
  disabled?: boolean;
}

const QuantityStepper = ({ value, min = 1, max = 99, onChange, disabled = false }: QuantityStepperProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Xử lý giảm số lượng (Có chặn click đúp)
  const handleDecrease = async () => {
    if (value > min && !isUpdating) {
      setIsUpdating(true);
      try {
        await onChange(value - 1);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Xử lý tăng số lượng (Có chặn click đúp)
  const handleIncrease = async () => {
    if (value < max && !isUpdating) {
      setIsUpdating(true);
      try {
        await onChange(value + 1);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className={styles.stepperWrapper}>
      {/* Nút Giảm */}
      <button
        onClick={handleDecrease}
        disabled={value <= min || disabled || isUpdating}
        className={styles.actionBtn}
        aria-label="Giảm số lượng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Hiển thị giá trị (hiện dấu 3 chấm nếu đang chờ API) */}
      <span className={styles.valueDisplay}>
        {isUpdating ? '...' : value}
      </span>

      {/* Nút Tăng */}
      <button
        onClick={handleIncrease}
        disabled={value >= max || disabled || isUpdating}
        className={styles.actionBtn}
        aria-label="Tăng số lượng"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default QuantityStepper;