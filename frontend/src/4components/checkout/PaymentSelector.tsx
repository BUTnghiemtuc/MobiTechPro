import { useState } from 'react';
import styles from './PaymentSelector.module.css';

export type PaymentMethod = 'cod' | 'momo' | 'zalopay' | 'vnpay' | 'card' | 'banking';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

interface PaymentSelectorProps {
  onNext: (method: PaymentMethod) => void;
  onBack: () => void;
}

const PaymentSelector = ({ onNext, onBack }: PaymentSelectorProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cod');

  const paymentOptions: PaymentOption[] = [
    { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: '💵', description: 'Thanh toán bằng tiền mặt khi nhận hàng', available: true },
    { id: 'momo', name: 'Ví MoMo', icon: '📱', description: 'Quét mã QR hoặc mở ứng dụng MoMo', available: true },
    { id: 'zalopay', name: 'ZaloPay', icon: '💰', description: 'Thanh toán qua ví điện tử ZaloPay', available: true },
    { id: 'vnpay', name: 'VNPay', icon: '🏦', description: 'ATM/Internet Banking/QR Code', available: true },
    { id: 'card', name: 'Thẻ tín dụng/ghi nợ', icon: '💳', description: 'Visa, MasterCard, JCB', available: true },
    { id: 'banking', name: 'Chuyển khoản ngân hàng', icon: '🏧', description: 'Chuyển khoản và upload xác nhận', available: false }, // Coming soon
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(selectedMethod);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Phương Thức Thanh Toán</h2>

      <div className={styles.optionsList}>
        {paymentOptions.map((option) => (
          <label
            key={option.id}
            className={`${styles.optionCard} ${selectedMethod === option.id ? styles.optionCardSelected : styles.optionCardHover} ${!option.available ? styles.optionCardDisabled : ''}`}
          >
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
              disabled={!option.available}
              className={styles.radioInput}
            />
            
            <div className={styles.contentWrapper}>
              <div className={styles.headerRow}>
                <span className={styles.icon}>{option.icon}</span>
                <div>
                  <div className={styles.nameBlock}>
                    {option.name}
                    {!option.available && <span className={styles.badge}>Sắp ra mắt</span>}
                  </div>
                  <div className={styles.description}>{option.description}</div>
                </div>
              </div>

              {/* Thông tin chi tiết hiện ra khi chọn */}
              {selectedMethod === option.id && option.available && (
                <div className={styles.detailsBox}>
                  {option.id === 'cod' && (
                    <div>
                      <span className={styles.detailHighlight}>✓ Phí COD: Miễn phí</span>
                      Vui lòng chuẩn bị số tiền chính xác khi nhận hàng.
                    </div>
                  )}
                  {option.id === 'momo' && (
                    <div>
                      <span className={styles.detailHighlight}>✓ Thanh toán an toàn với MoMo</span>
                      Bạn sẽ được chuyển đến trang thanh toán MoMo ở bước tiếp theo.
                    </div>
                  )}
                  {option.id === 'zalopay' && (
                    <div>
                      <span className={styles.detailHighlight}>✓ Thanh toán nhanh với ZaloPay</span>
                      Quét mã QR hoặc mở ứng dụng ZaloPay để thanh toán.
                    </div>
                  )}
                  {option.id === 'vnpay' && (
                    <div>
                      <span className={styles.detailHighlight}>✓ Hỗ trợ tất cả ngân hàng</span>
                      Thanh toán qua thẻ ATM, Internet Banking hoặc QR Code.
                    </div>
                  )}
                  {option.id === 'card' && (
                    <div>
                      <span className={styles.detailHighlight}>✓ Bảo mật PCI DSS</span>
                      Thông tin thẻ được mã hóa và bảo mật tuyệt đối.
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedMethod === option.id && option.available && (
              <div className={styles.checkIconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.checkIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Trust Badges */}
      <div className={styles.trustBanner}>
        <div className={styles.trustHeader}>
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.trustIcon} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Thanh toán 100% an toàn & bảo mật</span>
        </div>
        <p className={styles.trustText}>
          Thông tin thanh toán được mã hóa SSL 256-bit
        </p>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionGroup}>
        <button type="button" onClick={onBack} className={styles.backBtn}>
          ← Quay lại
        </button>
        <button type="submit" className={styles.nextBtn}>
          Tiếp tục →
        </button>
      </div>
    </form>
  );
};

export default PaymentSelector;