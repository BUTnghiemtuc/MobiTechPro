import styles from './ProgressIndicator.module.css';

interface ProgressIndicatorProps {
  currentStep: number;
  steps: string[];
}

const ProgressIndicator = ({ currentStep, steps }: ProgressIndicatorProps) => {
  // Tính toán % chiều dài của thanh màu xanh chạy dưới nền
  const calculateProgressWidth = () => {
    if (steps.length <= 1) return 0;
    // VD: 3 bước -> Có 2 khoảng trống. Đang ở bước 2 (index 1) -> Đạt 50%
    const ratio = currentStep / (steps.length - 1);
    return ratio * 100;
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        {/* Đường thẳng nằm dưới nền */}
        <div className={styles.backgroundLine}></div>
        {/* Đường thẳng màu xanh chạy theo tiến độ */}
        <div 
          className={styles.activeLine} 
          style={{ width: `${calculateProgressWidth()}%` }}
        ></div>

        {/* Các điểm neo (Chấm tròn) */}
        <div className={styles.progressContainer}>
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const stepNumber = index + 1;

            return (
              <div key={index} className={styles.stepItem}>
                
                {/* Vòng tròn */}
                <div
                  className={`${styles.circle} ${
                    isCompleted ? styles.circleCompleted : isActive ? styles.circleActive : ''
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.checkIcon}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>

                {/* Chữ ghi chú ở dưới */}
                <div className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
                  {step}
                </div>
                
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ProgressIndicator;