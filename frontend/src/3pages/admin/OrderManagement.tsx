import { useEffect, useState } from 'react';
import { orderService, type Order, OrderStatus } from '../../1services/order.service';
import { formatPrice } from '../../2utils/format';
import { toast } from 'react-toastify';
import { useAuth } from '../../2context/AuthContext';
import styles from './OrderManagement.module.css';

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
        <div className={styles.div_1}>
          <div className={styles.div_2}></div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className={styles.div_3}>
         <div>
           <h1 className={styles.h1_1}>Order Management</h1>
           <p className={styles.p_1}>Track and manage customer orders</p>
        </div>
      </div>

      <div className={styles.div_4}>
        <div className="overflow-x-auto">
        <table className={styles.table_1}>
          <thead className="bg-slate-50/50">
            <tr>
              <th className={styles.th_1}>Order ID</th>
              <th className={styles.th_1}>Customer</th>
              <th className={styles.th_1}>Date</th>
              <th className={styles.th_1}>Total</th>
              <th className={styles.th_2}>Status</th>
              <th className={styles.th_3}>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tbody_1}>
            {orders.length === 0 ? (
                <tr>
                    <td colSpan={6} className={styles.td_1}>
                        No orders found.
                    </td>
                </tr>
            ) : (
                orders.map((order) => (
                <tr key={order.id} className={styles.tr_1}>
                    <td className={styles.td_2}>
                    #{order.id}
                    </td>
                    <td className={styles.td_3}>
                    {order.user?.username || 'Guest'}
                    </td>
                    <td className={styles.td_4}>
                    {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className={styles.td_5}>
                      {formatPrice(order.total_price)}
                    </td>
                    <td className={styles.td_6}>
                    <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    </td>
                    <td className={styles.td_7}>
                       <div className={styles.div_5}>
                            {/* Status Dropdown (Simplified as Select) */}
                            <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                className={styles.el_1}
                            >
                                {Object.values(OrderStatus).map((status) => (
                                <option key={status} value={status}>{status}</option>
                                ))}
                            </select>

                            {/* Delete Button (Admin Only) */}
                            {user?.role === 'admin' && (
                                <button
                                onClick={() => handleDelete(order.id)}
                                className={styles.el_2}
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
