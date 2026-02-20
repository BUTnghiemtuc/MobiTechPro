import { useNavigate } from 'react-router-dom';

interface OrderSuccessPageProps {
  orderNumber?: string;
}

const OrderSuccessPage = ({ orderNumber = 'ORD-12345' }: OrderSuccessPageProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt Hàng Thành Công!</h1>
            <p className="text-gray-600">Cảm ơn bạn đã mua hàng tại MobiTechPro</p>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                <p className="font-semibold text-gray-900">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                <p className="font-semibold text-green-600">Đã xác nhận</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Bước tiếp theo:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Chúng tôi đã gửi email xác nhận đơn hàng cho bạn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">📦</span>
                <span>Đơn hàng sẽ được xử lý và giao trong 1-3 ngày làm việc</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">🚚</span>
                <span>Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/my-orders')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem Đơn Hàng
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-gray-600 mb-2">
              Cần hỗ trợ? Liên hệ chúng tôi:
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <a href="tel:1900xxxx" className="text-blue-600 hover:underline">
                📞 1900-xxxx
              </a>
              <a href="mailto:support@mobitechpro.com" className="text-blue-600 hover:underline">
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
