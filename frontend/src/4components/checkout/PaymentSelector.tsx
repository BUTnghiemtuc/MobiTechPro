import { useState } from 'react';

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
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: '💵',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      available: true,
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: '📱',
      description: 'Quét mã QR hoặc mở ứng dụng MoMo',
      available: true,
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: '💰',
      description: 'Thanh toán qua ví điện tử ZaloPay',
      available: true,
    },
    {
      id: 'vnpay',
      name: 'VNPay',
      icon: '🏦',
      description: 'ATM/Internet Banking/QR Code',
      available: true,
    },
    {
      id: 'card',
      name: 'Thẻ tín dụng/ghi nợ',
      icon: '💳',
      description: 'Visa, MasterCard, JCB',
      available: true,
    },
    {
      id: 'banking',
      name: 'Chuyển khoản ngân hàng',
      icon: '🏧',
      description: 'Chuyển khoản và upload xác nhận',
      available: false, // Coming soon
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(selectedMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Phương Thức Thanh Toán</h2>

      <div className="space-y-3 mb-8">
        {paymentOptions.map((option) => (
          <label
            key={option.id}
            className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethod === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
              disabled={!option.available}
              className="mt-1 mr-4"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{option.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {option.name}
                    {!option.available && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Sắp ra mắt
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
              </div>

              {/* Payment-specific info */}
              {selectedMethod === option.id && option.available && (
                <div className="mt-3 pl-14 text-sm text-gray-600 bg-white rounded p-3 border border-blue-100">
                  {option.id === 'cod' && (
                    <div>
                      <p className="font-medium text-blue-600 mb-1">✓ Phí COD: Miễn phí</p>
                      <p>Vui lòng chuẩn bị số tiền chính xác khi nhận hàng.</p>
                    </div>
                  )}
                  {option.id === 'momo' && (
                    <div>
                      <p className="font-medium text-blue-600 mb-1">✓ Thanh toán an toàn với MoMo</p>
                      <p>Bạn sẽ được chuyển đến trang thanh toán MoMo ở bước tiếp theo.</p>
                    </div>
                  )}
                  {option.id === 'zalopay' && (
                    <div>
                      <p className="font-medium text-blue-600 mb-1">✓ Thanh toán nhanh với ZaloPay</p>
                      <p>Quét mã QR hoặc mở ứng dụng ZaloPay để thanh toán.</p>
                    </div>
                  )}
                  {option.id === 'vnpay' && (
                    <div>
                      <p className="font-medium text-blue-600 mb-1">✓ Hỗ trợ tất cả ngân hàng</p>
                      <p>Thanh toán qua thẻ ATM, Internet Banking hoặc QR Code.</p>
                    </div>
                  )}
                  {option.id === 'card' && (
                    <div>
                      <p className="font-medium text-blue-600 mb-1">✓ Bảo mật PCI DSS</p>
                      <p>Thông tin thẻ được mã hóa và bảo mật tuyệt đối.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedMethod === option.id && option.available && (
              <div className="text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">Thanh toán 100% an toàn & bảo mật</span>
        </div>
        <p className="text-sm text-green-600">
          Thông tin thanh toán được mã hóa SSL 256-bit
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Quay lại
        </button>
        <button
          type="submit"
          className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Tiếp tục →
        </button>
      </div>
    </form>
  );
};

export default PaymentSelector;
