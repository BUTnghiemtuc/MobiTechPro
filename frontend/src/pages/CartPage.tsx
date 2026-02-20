import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { cartService, type CartItem } from '../services/cart.service';
import { orderService } from '../services/order.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import QuantityStepper from '../components/QuantityStepper';
import ShippingProgressBar from '../components/ShippingProgressBar';

// Định nghĩa URL Backend (nên để trong file config chung)
const API_BASE_URL = 'http://localhost:3000';

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    
    // State xử lý xóa item (loading cục bộ cho từng nút xóa)
    const [removingId, setRemovingId] = useState<number | null>(null);

    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();

    // ✅ Helper 1: Xử lý giá tiền an toàn (String hay Number đều chiều hết)
    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return numPrice.toFixed(2);
    };

    // ✅ Helper 2: Lấy URL ảnh chuẩn (tránh lỗi 404)
    const getImageUrl = (url?: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL}${url}`;
    };

    const fetchCart = async () => {
        setLoading(true);
        try {
            const items = await cartService.getCart();
            setCartItems(items);
        } catch (error: any) {
            console.error('Failed to fetch cart', error);
            if (error.response?.status === 401) {
                // Xử lý logout nếu token hết hạn
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                toast.error('Please log in to view your cart');
                navigate('/login');
            } else {
                toast.error('Failed to load cart');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }
            fetchCart();
        }
    }, [isAuthenticated, authLoading, navigate]);

    // ✅ Tính tổng tiền (đã bọc Number để an toàn)
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
            return total + (price * item.quantity);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        return subtotal - discount;
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.warn('Vui lòng nhập mã giảm giá');
            return;
        }

        setApplyingCoupon(true);
        try {
            // TODO: Call actual API endpoint
            // Simulate coupon validation
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Mock discount (10%)
            if (couponCode.toUpperCase() === 'SUMMER10') {
                const discountAmount = calculateSubtotal() * 0.1;
                setDiscount(discountAmount);
                toast.success(`Áp dụng mã thành công! Giảm $${discountAmount.toFixed(2)}`);
            } else {
                toast.error('Mã giảm giá không hợp lệ');
            }
        } catch (error) {
            toast.error('Không thể áp dụng mã giảm giá');
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
        try {
            await cartService.updateQuantity(cartItemId, newQuantity);
            // Update local state
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === cartItemId ? { ...item, quantity: newQuantity } : item
                )
            );
            toast.success('Quantity updated');
        } catch (error) {
            toast.error('Failed to update quantity');
            // Reload to get correct state
            fetchCart();
        }
    };

    // 🆕 Hàm Xóa sản phẩm khỏi giỏ
    const handleRemoveItem = async (cartItemId: number) => {
        setRemovingId(cartItemId);
        try {
            await cartService.removeFromCart(cartItemId);
            const newItems = cartItems.filter(item => item.id !== cartItemId);
            setCartItems(newItems);
            toast.success('Đã xóa sản phẩm');
        } catch (error) {
            toast.error('Không thể xóa sản phẩm');
        } finally {
            setRemovingId(null);
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.warn('Giỏ hàng trống');
            return;
        }
        navigate('/checkout');
    };

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading your cart...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
                    <div className="mb-4 text-gray-300">
                        {/* Icon giỏ hàng rỗng */}
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <p className="text-gray-500 text-lg mb-6">Your cart is currently empty.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Danh sách sản phẩm */}
                    <div className="lg:col-span-2">
                         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                        <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                        <th scope="col" className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {/* ✅ HIỂN THỊ ẢNH SẢN PHẨM */}
                                                    <div className="flex-shrink-0 h-16 w-16 border rounded overflow-hidden bg-gray-100">
                                                        <img 
                                                            className="h-full w-full object-cover" 
                                                            src={getImageUrl(item.product.image_url)} 
                                                            alt={item.product.title}
                                                            onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/150'}}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-[200px]" title={item.product.title}>
                                                            {item.product.title}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="text-sm text-gray-500">${formatPrice(item.product.price)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <QuantityStepper
                                                    value={item.quantity}
                                                    max={item.product.quantity}
                                                    onChange={(newQty) => handleUpdateQuantity(item.id, newQty)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm text-gray-900 font-bold">
                                                    ${(parseFloat(formatPrice(item.product.price)) * item.quantity).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={removingId === item.id}
                                                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 p-2 rounded-lg hover:bg-red-50"
                                                    aria-label="Remove item"
                                                    title="Xóa khỏi giỏ"
                                                >
                                                    {removingId === item.id ? (
                                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>

                    {/* Cột phải: Tổng tiền & Checkout */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
                            <h2 className="text-lg font-bold mb-6 text-gray-800 border-b pb-4">Tổng Đơn Hàng</h2>
                            
                            {/* Coupon Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã..."
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={applyingCoupon}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50"
                                    >
                                        {applyingCoupon ? '...' : 'Áp dụng'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Thử: SUMMER10</p>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Tạm tính:</span>
                                    <span>${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                
                                {discount > 0 && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Giảm giá:</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-green-600 font-medium">Miễn phí 🎉</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center mb-6 text-xl font-bold text-gray-900 pt-4 border-t">
                                <span>Tổng cộng:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-3 px-4 rounded-lg text-white font-bold text-lg transition shadow-md bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform active:scale-95"
                            >
                                Thanh Toán
                            </button>
                            
                            {/* Payment Methods */}
                            <div className="mt-6 pt-6 border-t">
                                <p className="text-xs text-gray-500 text-center mb-3">Thanh toán an toàn với:</p>
                                <div className="flex justify-center items-center gap-3 flex-wrap">
                                    <div className="text-2xl" title="Visa">💳</div>
                                    <div className="text-2xl" title="MasterCard">💳</div>
                                    <div className="text-2xl" title="MoMo">📱</div>
                                    <div className="text-2xl" title="ZaloPay">💰</div>
                                    <div className="text-2xl" title="COD">💵</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;