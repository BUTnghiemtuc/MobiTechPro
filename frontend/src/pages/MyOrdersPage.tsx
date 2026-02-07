import { useEffect, useState } from 'react';
import { orderService, type Order } from '../services/order.service';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-display font-bold text-slate-800 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link to="/" className="text-primary-600 font-medium hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-sm text-gray-500">
                    Order <span className="font-mono font-medium text-slate-700">#{order.id}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    <span className="font-bold text-slate-800 text-lg">
                        ${Number(order.total_price).toFixed(2)}
                    </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      {item.product.image_url && (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.title} 
                          className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                        />
                      )}
                      <div className="flex-1">
                        <Link to={`/products/${item.product.id}`} className="font-medium text-slate-800 hover:text-primary-600 transition">
                            {item.product.title}
                        </Link>
                        <div className="text-sm text-gray-500">
                           Price: ${Number(item.price_at_purchase).toFixed(2)} x {item.quantity}
                        </div>
                      </div>
                      <div className="text-right font-medium text-slate-700">
                        ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    <span className="font-medium text-slate-700">Shipping Address: </span> 
                    {order.address}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
