import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { cartService, type CartItem } from '../services/cart.service';
import { orderService } from '../services/order.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Định nghĩa URL Backend (nên để trong file config chung)
const API_BASE_URL = 'http://localhost:3000';

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    
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
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
            return total + (price * item.quantity);
        }, 0);
    };

    // 🆕 Hàm Xóa sản phẩm khỏi giỏ
    const handleRemoveItem = async (cartItemId: number) => {
        if (!window.confirm("Are you sure you want to remove this item?")) return;
        
        setRemovingId(cartItemId);
        try {
            // TODO: Gọi API backend thực tế ở đây
             await cartService.removeFromCart(cartItemId); 
             // Tạm thời mình lọc ở client để demo hiệu ứng
             const newItems = cartItems.filter(item => item.id !== cartItemId);
             setCartItems(newItems);
             
             toast.success("Item removed");
             // fetchCart(); // Load lại cho chắc
             
        } catch (error) {
            toast.error("Failed to remove item");
        } finally {
            setRemovingId(null);
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.warn('Your cart is empty');
            return;
        }

        setCheckingOut(true);
        try {
            const address = "Hanoi, Vietnam"; 
            await orderService.createOrder(address);
            
            toast.success('Order placed successfully!');
            setCartItems([]); // Clear giỏ hàng local (Backend đã clear rồi)
            navigate('/my-orders'); // Chuyển hướng sang trang My Orders
        } catch (error: any) {
            console.error('Checkout failed', error);
            toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setCheckingOut(false);
        }
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
                                                <div className="text-sm text-gray-900 font-medium inline-block bg-gray-100 px-3 py-1 rounded">
                                                    {item.quantity}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-sm text-gray-900 font-bold">
                                                    ${(parseFloat(formatPrice(item.product.price)) * item.quantity).toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {/* 🆕 NÚT XÓA */}
                                                <button 
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={removingId === item.id}
                                                    className="text-red-600 hover:text-red-900 transition disabled:opacity-50"
                                                >
                                                    {removingId === item.id ? '...' : 'Remove'}
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
                            <h2 className="text-lg font-bold mb-6 text-gray-800 border-b pb-4">Order Summary</h2>
                            
                            <div className="flex justify-between items-center mb-2 text-gray-600">
                                <span>Subtotal</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-6 text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-6 text-xl font-bold text-gray-900 pt-4 border-t">
                                <span>Total</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className={`w-full py-3 px-4 rounded-lg text-white font-bold text-lg transition shadow-md ${
                                    checkingOut 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform active:scale-95'
                                }`}
                            >
                                {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                            
                            <p className="text-xs text-gray-400 text-center mt-4">
                                Secure Checkout - 100% Money Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;