import { useEffect, useState } from 'react';
import { useAuth } from '../../2context/AuthContext';
import { cartService, type CartItem } from '../../1services/cart.service';
import { formatPrice } from '../../2utils/format';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import QuantityStepper from '../../4components/QuantityStepper/QuantityStepper';

const API_BASE_URL = 'http://localhost:3000';

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const getImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const items = await cartService.getCart();
      setCartItems(items);

      const availableIds = items
        .filter(item => item.product.quantity >= item.quantity)
        .map(item => item.id);

      setSelectedItemIds(availableIds);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.clear();
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
  }, [isAuthenticated, authLoading]);

  const calculateSubtotal = () => {
    return cartItems
      .filter(item => selectedItemIds.includes(item.id))
      .reduce((total, item) => {
        const price =
          typeof item.product.price === 'string'
            ? parseFloat(item.product.price)
            : item.product.price;
        return total + price * item.quantity;
      }, 0);
  };

  const calculateTotal = () => calculateSubtotal() - discount;

  const handleUpdateQuantity = async (id: number, qty: number) => {
    try {
      await cartService.updateQuantity(id, qty);
      setCartItems(prev =>
        prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
      );
    } catch {
      fetchCart();
    }
  };

  const handleRemoveItem = async (id: number) => {
    setRemovingId(id);
    try {
      await cartService.removeFromCart(id);
      setCartItems(prev => prev.filter(i => i.id !== id));
    } finally {
      setRemovingId(null);
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCheckout = () => {
    if (selectedItemIds.length === 0) {
      toast.warn('Chọn sản phẩm để thanh toán');
      return;
    }
    navigate('/checkout', { state: { selectedIds: selectedItemIds } });
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 pt-28 pb-20 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow">
          Giỏ hàng trống
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => {
              const isOut = item.product.quantity < item.quantity;
              const isSelected = selectedItemIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border hover:shadow transition ${
                    isOut ? 'opacity-60' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600"
                    checked={isSelected}
                    disabled={isOut}
                    onChange={() => toggleSelectItem(item.id)}
                  />

                  <img
                    src={getImageUrl(item.product.image_url)}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />

                  <div className="flex-1">
                    <div className="font-semibold line-clamp-2">
                      {item.product.title}
                    </div>

                    {isOut ? (
                      <span className="text-red-500 text-xs">
                        Hết hàng
                      </span>
                    ) : (
                      <span className="text-green-600 text-xs bg-green-100 px-2 py-0.5 rounded-full">
                        Còn hàng
                      </span>
                    )}
                  </div>

                  <div className="w-28 text-gray-500 text-sm">
                    {formatPrice(item.product.price)}
                  </div>

                  <QuantityStepper
                    value={item.quantity}
                    max={item.product.quantity}
                    onChange={q => handleUpdateQuantity(item.id, q)}
                  />

                  <div className="w-32 text-right font-bold">
                    {formatPrice(
                      Number(item.product.price) * item.quantity
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    {removingId === item.id ? '...' : 'Xóa'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-2xl shadow-md border p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-6">Tổng đơn hàng</h2>

            <div className="flex gap-2 mb-4">
              <input
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                placeholder="Mã giảm giá"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                onClick={() => setDiscount(calculateSubtotal() * 0.1)}
                className="px-4 bg-gray-100 rounded-lg"
              >
                Áp dụng
              </button>
            </div>

            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between text-xl font-bold mt-4 border-t pt-4">
              <span>Tổng</span>
              <span className="text-blue-600">
                {formatPrice(calculateTotal())}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={selectedItemIds.length === 0}
              className="w-full mt-6 py-3 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 transition disabled:bg-gray-300"
            >
              Thanh toán ({selectedItemIds.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;