import { useEffect, useState } from 'react';
import { useAuth } from '../../2context/AuthContext';
import { cartService, type CartItem } from '../../1services/cart.service';
import { orderService } from '../../1services/order.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import QuantityStepper from '../../4components/QuantityStepper/QuantityStepper';
import ShippingProgressBar from '../../4components/ShippingProgressBar/ShippingProgressBar';
import styles from './CartPage.module.css';

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
        return <div className={styles.div_1}>Loading your cart...</div>;
    }

    return (
        <div className={styles.div_2}>
            <h1 className={styles.h1_1}>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className={styles.div_3}>
                    <div className={styles.div_4}>
                        {/* Icon giỏ hàng rỗng */}
                        <svg className={styles.svg_1} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <p className={styles.p_1}>Your cart is currently empty.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className={styles.el_1}
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className={styles.div_5}>
                    {/* Cột trái: Danh sách sản phẩm */}
                    <div className="lg:col-span-2">
                         <div className={styles.div_6}>
                            <table className={styles.table_1}>
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className={styles.th_1}>Product</th>
                                        <th scope="col" className={styles.th_2}>Price</th>
                                        <th scope="col" className={styles.th_2}>Qty</th>
                                        <th scope="col" className={styles.th_3}>Total</th>
                                        <th scope="col" className={styles.th_4}></th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tbody_1}>
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className={styles.th_4}>
                                                <div className={styles.div_7}>
                                                    {/* ✅ HIỂN THỊ ẢNH SẢN PHẨM */}
                                                    <div className={styles.div_8}>
                                                        <img 
                                                            className={styles.img_1} 
                                                            src={getImageUrl(item.product.image_url)} 
                                                            alt={item.product.title}
                                                            onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/150'}}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className={styles.div_9} title={item.product.title}>
                                                            {item.product.title}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={styles.td_1}>
                                                <div className={styles.div_10}>${formatPrice(item.product.price)}</div>
                                            </td>
                                            <td className={styles.td_1}>
                                                <QuantityStepper
                                                    value={item.quantity}
                                                    max={item.product.quantity}
                                                    onChange={(newQty) => handleUpdateQuantity(item.id, newQty)}
                                                />
                                            </td>
                                            <td className={styles.td_2}>
                                                <div className={styles.div_11}>
                                                    ${(parseFloat(formatPrice(item.product.price)) * item.quantity).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className={styles.td_1}>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={removingId === item.id}
                                                    className={styles.el_2}
                                                    aria-label="Remove item"
                                                    title="Xóa khỏi giỏ"
                                                >
                                                    {removingId === item.id ? (
                                                        <svg className={styles.svg_2} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg_3} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <div className={styles.div_12}>
                            <h2 className={styles.h2_1}>Tổng Đơn Hàng</h2>
                            
                            {/* Coupon Input */}
                            <div className="mb-6">
                                <label className={styles.label_1}>Mã giảm giá</label>
                                <div className={styles.div_13}>
                                    <input
                                        type="text"
                                        placeholder="Nhập mã..."
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className={styles.el_3}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={applyingCoupon}
                                        className={styles.button_1}
                                    >
                                        {applyingCoupon ? '...' : 'Áp dụng'}
                                    </button>
                                </div>
                                <p className={styles.p_2}>Thử: SUMMER10</p>
                            </div>

                            {/* Price Breakdown */}
                            <div className={styles.div_14}>
                                <div className={styles.div_15}>
                                    <span>Tạm tính:</span>
                                    <span>${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                
                                {discount > 0 && (
                                    <div className={styles.div_16}>
                                        <span>Giảm giá:</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                
                                <div className={styles.div_15}>
                                    <span>Phí vận chuyển:</span>
                                    <span className={styles.span_1}>Miễn phí 🎉</span>
                                </div>
                            </div>
                            
                            <div className={styles.div_17}>
                                <span>Tổng cộng:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className={styles.button_2}
                            >
                                Thanh Toán
                            </button>
                            
                            {/* Payment Methods */}
                            <div className={styles.div_18}>
                                <p className={styles.p_3}>Thanh toán an toàn với:</p>
                                <div className={styles.div_19}>
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