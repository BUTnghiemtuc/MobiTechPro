import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProgressIndicator from '../../4components/checkout/ProgressIndicator';
import ShippingForm from '../../4components/checkout/ShippingForm';
import PaymentSelector, { type PaymentMethod } from '../../4components/checkout/PaymentSelector';
import OrderReview from '../../4components/checkout/OrderReview';
import { orderService } from '../../1services/order.service';
import styles from './CheckoutPage.module.css';

interface ShippingData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  zipCode: string;
  notes: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const steps = ['Giao hàng', 'Thanh toán', 'Xác nhận'];

  const handleShippingNext = (data: ShippingData) => {
    setShippingData(data);
    setCurrentStep(1);
  };

  const handlePaymentNext = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setCurrentStep(2);
  };

  const handleToggleGuest = () => {
    setIsGuest(!isGuest);
  };

  const handlePlaceOrder = async () => {
    if (!shippingData || !paymentMethod) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setPlacingOrder(true);
    try {
      // Format address for backend
      const fullAddress = `${shippingData.fullName} | ${shippingData.phone} | ${shippingData.address}, ${shippingData.ward ? shippingData.ward + ', ' : ''}${shippingData.district}, ${shippingData.city}`;
      
      // Create order (backend currently only accepts address)
      // TODO: Update backend to accept payment method and shipping details
      await orderService.createOrder(fullAddress);

      toast.success('Đặt hàng thành công!');
      
      // Navigate to success page
      navigate('/checkout/success');
    } catch (error: any) {
      console.error('Order placement failed:', error);
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className={styles.div_1}>
      <div className={styles.div_2}>
        {/* Header */}
        <div className={styles.div_3}>
          <h1 className={styles.h1_1}>Thanh Toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn trong 3 bước đơn giản</p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} steps={steps} />

        {/* Step Content */}
        <div className="mt-12">
          {currentStep === 0 && (
            <ShippingForm
              onNext={handleShippingNext}
              isGuest={isGuest}
              onToggleGuest={handleToggleGuest}
            />
          )}

          {currentStep === 1 && (
            <PaymentSelector
              onNext={handlePaymentNext}
              onBack={() => setCurrentStep(0)}
            />
          )}

          {currentStep === 2 && shippingData && paymentMethod && (
            <OrderReview
              shippingData={shippingData}
              paymentMethod={paymentMethod}
              onBack={() => setCurrentStep(1)}
              onEditShipping={() => setCurrentStep(0)}
              onEditPayment={() => setCurrentStep(1)}
              onPlaceOrder={handlePlaceOrder}
            />
          )}

          {placingOrder && (
            <div className={styles.div_4}>
              <div className={styles.div_5}>
                <div className={styles.div_6}></div>
                <p className={styles.p_1}>Đang xử lý đơn hàng...</p>
              </div>
            </div>
          )}
        </div>

        {/* Back to Cart */}
        <div className={styles.div_7}>
          <button
            onClick={() => navigate('/cart')}
            className={styles.el_1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg_1} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
