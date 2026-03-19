import { useEffect, useState } from 'react';
import { cartService, type CartItem } from '../../1services/cart.service';
import type { PaymentMethod } from './PaymentSelector';
import { formatPrice } from '../../2utils/format';
import styles from './OrderReview.module.css';

interface OrderReviewProps {
  shippingData: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    zipCode: string;
    notes: string;
  };
  paymentMethod: PaymentMethod;
  onBack: () => void;
  onEditShipping: () => void;
  onEditPayment: () => void;
  onPlaceOrder: () => void;
  discount?: number;
  selectedIds?: number[];
}

const OrderReview = ({
  shippingData,
  paymentMethod,
  onBack,
  onEditShipping,
  onEditPayment,
  onPlaceOrder,
  discount = 0,
  selectedIds,
}: OrderReviewProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const items = await cartService.getCart();
      const filteredItems = selectedIds && selectedIds.length > 0
        ? items.filter(item => selectedIds.includes(item.id))
        : items;
      setCartItems(filteredItems);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng', error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy đường dẫn ảnh chuẩn từ biến môi trường
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';
  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };


  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = 0; // Free shipping
  const total = subtotal - discount + shipping;

  const getPaymentMethodName = (method: PaymentMethod) => {
    const methods = {
      cod: '💵 Thanh toán khi nhận hàng (COD)',
      momo: '📱 Ví MoMo',
      zalopay: '💰 ZaloPay',
      vnpay: '🏦 VNPay',
      card: '💳 Thẻ tín dụng/ghi nợ',
      banking: '🏧 Chuyển khoản ngân hàng',
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        
        {/* Cột trái: Thông tin Giao hàng & Sản phẩm */}
        <div className={styles.leftCol}>
          
          {/* Box: Thông tin giao hàng */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Thông tin giao hàng</h3>
              <button onClick={onEditShipping} className={styles.editBtn}>
                Sửa
              </button>
            </div>
            <div>
              <p className={styles.infoName}>{shippingData.fullName}</p>
              <p className={styles.infoText}>{shippingData.phone} | {shippingData.email}</p>
              <p className={styles.infoText}>{shippingData.address}</p>
              <p className={styles.infoText}>
                {shippingData.ward && `${shippingData.ward}, `}
                {shippingData.district}, {shippingData.city}
              </p>
              {shippingData.notes && (
                <p className={styles.noteText}>Ghi chú: {shippingData.notes}</p>
              )}
            </div>
          </div>

          {/* Box: Phương thức thanh toán */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Phương thức thanh toán</h3>
              <button onClick={onEditPayment} className={styles.editBtn}>
                Sửa
              </button>
            </div>
            <p className={styles.infoText} style={{ fontSize: '1rem' }}>
              {getPaymentMethodName(paymentMethod)}
            </p>
          </div>

          {/* Box: Danh sách món hàng */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>
              Giỏ hàng ({cartItems.length} sản phẩm)
            </h3>
            <div className={styles.cartList}>
              {cartItems.map((item) => {
                const itemPrice = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
                return (
                  <div key={item.id} className={styles.cartItem}>
                    <img
                      src={getImageUrl(item.product.image_url)}
                      alt={item.product.title}
                      className={styles.itemImg}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Image';
                      }}
                    />
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemTitle}>{item.product.title}</h4>
                      <p className={styles.itemQty}>Số lượng: {item.quantity}</p>
                    </div>
                    <div className={styles.itemPriceBox}>
                      <p className={styles.itemTotal}>
                        {formatPrice(itemPrice * item.quantity)}
                      </p>
                      <p className={styles.itemUnit}>
                        {formatPrice(itemPrice)} x {item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cột phải: Hóa đơn tóm tắt */}
        <div>
          <div className={`${styles.card} ${styles.summarySticky}`}>
            <h3 className={styles.summaryTitle}>Tổng Đơn Hàng</h3>

            <div>
              <div className={styles.summaryRow}>
                <span>Tạm tính:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className={styles.discountRow}>
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>Phí vận chuyển:</span>
                <span className={styles.freeShipping}>Miễn phí 🎉</span>
              </div>
            </div>

            <div className={styles.totalRow}>
              <span>Tổng cộng:</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button onClick={onPlaceOrder} className={styles.placeOrderBtn}>
              ĐẶT HÀNG
            </button>

            <button onClick={onBack} className={styles.backBtn}>
              ← Quay lại
            </button>

            {/* Dấu hiệu chứng nhận an toàn */}
            <div className={styles.trustBox}>
              <div className={styles.secureText}>
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.secureIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Thanh toán an toàn</span>
              </div>
              <p className={styles.policyText}>
                Bằng cách đặt hàng, bạn đồng ý với <br />
                <a href="#" className={styles.policyLink}>Điều khoản</a> &{' '}
                <a href="#" className={styles.policyLink}>Chính sách</a> của chúng tôi.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OrderReview;