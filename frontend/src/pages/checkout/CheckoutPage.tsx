import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProgressIndicator from '../../components/checkout/ProgressIndicator';
import ShippingForm from '../../components/checkout/ShippingForm';
import PaymentSelector, { type PaymentMethod } from '../../components/checkout/PaymentSelector';
import OrderReview from '../../components/checkout/OrderReview';
import { orderService } from '../../services/order.service';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh Toán</h1>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">Đang xử lý đơn hàng...</p>
              </div>
            </div>
          )}
        </div>

        {/* Back to Cart */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/cart')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
