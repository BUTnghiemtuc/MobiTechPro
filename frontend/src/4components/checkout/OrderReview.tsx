import { useEffect, useState } from 'react';
import { cartService, type CartItem } from '../../1services/cart.service';
import type { PaymentMethod } from './PaymentSelector';

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
}

const OrderReview = ({
  shippingData,
  paymentMethod,
  onBack,
  onEditShipping,
  onEditPayment,
  onPlaceOrder,
  discount = 0,
}: OrderReviewProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const items = await cartService.getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const API_BASE_URL = 'http://localhost:3000';
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
    return methods[method];
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-gray-800">Thông tin giao hàng</h3>
              <button
                onClick={onEditShipping}
                className="text-blue-600 text-sm hover:underline"
              >
                Sửa
              </button>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900">{shippingData.fullName}</p>
              <p>{shippingData.phone} | {shippingData.email}</p>
              <p>{shippingData.address}</p>
              <p>
                {shippingData.ward && `${shippingData.ward}, `}
                {shippingData.district}, {shippingData.city}
              </p>
              {shippingData.notes && (
                <p className="mt-2 italic text-gray-500">Ghi chú: {shippingData.notes}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-gray-800">Phương thức thanh toán</h3>
              <button
                onClick={onEditPayment}
                className="text-blue-600 text-sm hover:underline"
              >
                Sửa
              </button>
            </div>
            <p className="text-gray-700">{getPaymentMethodName(paymentMethod)}</p>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">
              Giỏ hàng ({cartItems.length} sản phẩm)
            </h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <img
                    src={getImageUrl(item.product.image_url)}
                    alt={item.product.title}
                    className="w-20 h-20 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/80';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{item.product.title}</h4>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(parseFloat(item.product.price.toString()) * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${parseFloat(item.product.price.toString()).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
            <h3 className="font-bold text-lg text-gray-800 mb-6 pb-4 border-b">
              Tổng Đơn Hàng
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="text-green-600 font-medium">Miễn phí 🎉</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t mb-6">
              <span>Tổng cộng:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              onClick={onPlaceOrder}
              className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl mb-4"
            >
              ĐẶT HÀNG
            </button>

            <button
              onClick={onBack}
              className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Quay lại
            </button>

            {/* Trust Indicators */}
            <div className="mt-6 pt-6 border-t text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Thanh toán an toàn</span>
              </div>
              <p className="text-xs text-gray-500">
                Bằng cách đặt hàng, bạn đồng ý với <br />
                <a href="#" className="text-blue-600 hover:underline">Điều khoản</a> &{' '}
                <a href="#" className="text-blue-600 hover:underline">Chính sách</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;
