import { useEffect, useState } from 'react';
import { orderService, type Order, OrderStatus } from '../../services/order.service';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
       console.error(error);
       toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await orderService.updateStatus(orderId, newStatus as OrderStatus);
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await orderService.deleteOrder(orderId);
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
       toast.error('Failed to delete order');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
         <div>
           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Order Management</h1>
           <p className="text-slate-500 text-sm">Track and manage customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {orders.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No orders found.
                    </td>
                </tr>
            ) : (
                orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {order.user?.username || 'Guest'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                    ${Number(order.total_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex items-center justify-end gap-2">
                            {/* Status Dropdown (Simplified as Select) */}
                            <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                className="text-xs border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 py-1 pl-2 pr-6"
                            >
                                {Object.values(OrderStatus).map((status) => (
                                <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            {/* Delete Button (Admin Only) */}
                            {user?.role === 'Admin' && (
                                <button
                                onClick={() => handleDelete(order.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete Order"
                                >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            )}
                       </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
