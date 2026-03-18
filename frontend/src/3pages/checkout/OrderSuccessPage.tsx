import { useNavigate } from 'react-router-dom';
import styles from './OrderSuccessPage.module.css';

interface OrderSuccessPageProps {
  orderNumber?: string;
}

const OrderSuccessPage = ({ orderNumber = 'ORD-12345' }: OrderSuccessPageProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.div_1}>
      <div className={styles.div_2}>
        <div className={styles.div_3}>
          {/* Success Icon */}
          <div className="mb-6">
            <div className={styles.div_4}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg_1}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className={styles.h1_1}>Đặt Hàng Thành Công!</h1>
            <p className="text-gray-600">Cảm ơn bạn đã mua hàng tại MobiTechPro</p>
          </div>

          {/* Order Info */}
          <div className={styles.div_5}>
            <div className={styles.div_6}>
              <div>
                <p className={styles.p_1}>Mã đơn hàng</p>
                <p className={styles.p_2}>{orderNumber}</p>
              </div>
              <div>
                <p className={styles.p_1}>Trạng thái</p>
                <p className={styles.p_3}>Đã xác nhận</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className={styles.div_7}>
            <h3 className={styles.h3_1}>Bước tiếp theo:</h3>
            <ul className={styles.ul_1}>
              <li className={styles.li_1}>
                <span className={styles.span_1}>✓</span>
                <span>Chúng tôi đã gửi email xác nhận đơn hàng cho bạn</span>
              </li>
              <li className={styles.li_1}>
                <span className={styles.span_2}>📦</span>
                <span>Đơn hàng sẽ được xử lý và giao trong 1-3 ngày làm việc</span>
              </li>
              <li className={styles.li_1}>
                <span className={styles.span_2}>🚚</span>
                <span>Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={styles.div_8}>
            <button
              onClick={() => navigate('/my-orders')}
              className={styles.el_1}
            >
              Xem Đơn Hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className={styles.el_2}
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>

          {/* Contact Info */}
          <div className={styles.div_9}>
            <p className={styles.p_4}>
              Cần hỗ trợ? Liên hệ chúng tôi:
            </p>
            <div className={styles.div_10}>
              <a href="tel:1900xxxx" className={styles.a_1}>
                📞 1900-xxxx
              </a>
              <a href="mailto:support@mobitechpro.com" className={styles.a_1}>
                ✉️ support@mobitechpro.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
