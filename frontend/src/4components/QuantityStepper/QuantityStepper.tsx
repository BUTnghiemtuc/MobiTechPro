import { useState, useEffect } from 'react';
import styles from './QuantityStepper.module.css';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (newValue: number) => void | Promise<void>;
  disabled?: boolean;
}

const QuantityStepper = ({
  value,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: QuantityStepperProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Sync khi value từ props thay đổi
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // 👉 debounce khi nhập (500ms)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (localValue !== value) {
        let val = localValue;

        if (val < min) val = min;
        if (val > max) val = max;

        setIsUpdating(true);
        try {
          await onChange(val);
        } finally {
          setIsUpdating(false);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localValue]);

  // Giảm
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

  // Tăng
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

  // Nhập tay
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      setLocalValue(val);
    }
  };

  return (
    <div className={styles.stepperWrapper}>
      {/* - */}
      <button
        onClick={handleDecrease}
        disabled={value <= min || disabled || isUpdating}
        className={styles.actionBtn}
      >
        -
      </button>

      {/* INPUT */}
      <input
        type="number"
        value={localValue}
        onChange={handleInputChange}
        disabled={disabled}
        className={styles.input}
      />

      {/* + */}
      <button
        onClick={handleIncrease}
        disabled={value >= max || disabled || isUpdating}
        className={styles.actionBtn}
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepper;