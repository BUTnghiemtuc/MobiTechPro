import { useEffect, useState } from 'react';
import { orderService, type Order } from '../../1services/order.service';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './MyOrdersPage.module.css';

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

  if (loading) return <div className={styles.div_1}>Loading orders...</div>;

  return (
    <div className={styles.div_2}>
      <h1 className={styles.h1_1}>My Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.div_3}>
          <p className={styles.p_1}>You haven't placed any orders yet.</p>
          <Link to="/" className={styles.Link_1}>Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className={styles.div_4}>
              <div className={styles.div_5}>
                <div>
                  <div className={styles.div_6}>
                    Order <span className={styles.span_1}>#{order.id}</span>
                  </div>
                  <div className={styles.div_7}>
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className={styles.div_8}>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                    </span>
                    <span className={styles.span_2}>
                        ${Number(order.total_price).toFixed(2)}
                    </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className={styles.div_8}>
                      {item.product.image_url && (
                        <img 
                          src={item.product.image_url} 
                          alt={item.product.title} 
                          className={styles.img_1}
                        />
                      )}
                      <div className="flex-1">
                        <Link to={`/products/${item.product.id}`} className={styles.Link_2}>
                            {item.product.title}
                        </Link>
                        <div className={styles.div_6}>
                           Price: ${Number(item.price_at_purchase).toFixed(2)} x {item.quantity}
                        </div>
                      </div>
                      <div className={styles.div_9}>
                        ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.div_10}>
                    <span className={styles.span_3}>Shipping Address: </span> 
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
