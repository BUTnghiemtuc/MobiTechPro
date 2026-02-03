import React, { useEffect, useState } from 'react';
import { cartService, type CartItem } from '../services/cart.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    const navigate = useNavigate();

    const fetchCart = async () => {
        setLoading(true);
        try {
            const items = await cartService.getCart();
            setCartItems(items);
        } catch (error) {
            console.error('Failed to fetch cart', error);
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.warn('Your cart is empty');
            return;
        }

        setCheckingOut(true);
        try {
            // Hardcoded address for now as per requirements, could be an input field
            const address = "Hanoi, Vietnam"; 
            await cartService.checkout(address);
            toast.success('Order placed successfully!');
            setCartItems([]);
            navigate('/');
        } catch (error: any) {
            console.error('Checkout failed', error);
            toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading cart...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-500 mb-4">Your cart is empty.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                         <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{item.product.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">${typeof item.product.price === 'string' ? parseFloat(item.product.price).toFixed(2) : item.product.price.toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{item.quantity}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-semibold">
                                                  ${((typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price) * item.quantity).toFixed(2)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                            <div className="flex justify-between items-center mb-4 text-xl font-bold">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition ${
                                    checkingOut 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                                }`}
                            >
                                {checkingOut ? 'Processing...' : 'Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
