import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { productService, type Product } from '../../1services/product.service';
import { cartService } from '../../1services/cart.service';
import { useAuth } from '../../2context/AuthContext';
import { useCart } from '../../2context/CartContext';
import { formatPrice } from '../../2utils/format';
import { toast } from 'react-toastify';
import styles from './FlashSale.module.css';

const FlashSale = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();

  // Dùng biến môi trường
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
    fetchFlashSaleProducts();
    
    // Bộ đếm ngược
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchFlashSaleProducts = async () => {
    try {
      setLoading(true);
      // Lấy 4 sản phẩm
      const response = await productService.getProducts(2, 4, '', '');
      setProducts(response.data);
    } catch (error) {
      console.error('Lỗi tải Flash Sale:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };


  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để mua hàng');
      navigate('/login');
      return;
    }
    
    try {
      await cartService.addToCart(product.id, 1);
      toast.success(`Đã thêm ${product.title} vào giỏ hàng`);
      fetchCart();
    } catch (error) {
      console.error('Lỗi khi mua hàng:', error);
      toast.error('Mua hàng thất bại');
    }
  };

  if (loading) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* --- Header & Bộ Đếm Ngược --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.headerBox}
        >
          <div className={styles.headerContent}>
            <div>
              <h2 className={styles.title}>
                ⚡ Flash Sale
              </h2>
              <p className={styles.subtitle}>
                Giảm giá sốc chỉ trong hôm nay
              </p>
            </div>

            <div className={styles.timerContainer}>
              <span className={styles.timerLabel}>Kết thúc sau:</span>
              <div className={styles.timerBlocks}>
                {[
                  { value: timeLeft.hours, label: 'Giờ' },
                  { value: timeLeft.minutes, label: 'Phút' },
                  { value: timeLeft.seconds, label: 'Giây' }
                ].map((item, index) => (
                  <div key={index} className={styles.timeBlock}>
                    <div className={styles.timeValueBox}>
                      <span className={styles.timeValue}>
                        {item.value.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className={styles.timeUnit}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- Lưới Sản Phẩm --- */}
        <div className={styles.grid}>
          {products.map((product, index) => {
            // Sửa lại logic: API đang trả về giá hiện tại. 
            // Giả sử giá API trả về là giá Gốc (originalPrice)
            // Giá sale là giá gốc x 0.7 (giảm 30%)
            const originalPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
            const salePrice = originalPrice * 0.7; 

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/products/${product.id}`)}
                className={styles.cardWrapper}
              >
                {/* Nhãn -30% */}
                <div className={styles.discountBadge}>
                  -30%
                </div>

                <div className={styles.flashCard}>
                  {/* Hình Ảnh */}
                  <div className={styles.imageBox}>
                    {product.image_url ? (
                      <img
                        src={getImageUrl(product.image_url)}
                        alt={product.title}
                        className={styles.productImg}
                      />
                    ) : (
                      <div className={styles.noImageText}>Chưa có ảnh</div>
                    )}
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className={styles.infoBox}>
                    <h3 className={styles.productTitle}>
                      {product.title}
                    </h3>
                    
                    {/* Giá tiền */}
                    <div className={styles.priceRow}>
                      <span className={styles.salePrice}>
                        {formatPrice(salePrice)}
                      </span>
                      <span className={styles.originalPrice}>
                        {formatPrice(originalPrice)}
                      </span>
                    </div>

                    {/* Thanh giả lập tồn kho (Có thể sửa thành random nếu thích) */}
                    <div className={styles.stockBox}>
                      <div className={styles.stockLabels}>
                        <span>Đã bán: 45</span>
                        <span>Còn lại: 15</span>
                      </div>
                      <div className={styles.stockTrack}>
                        <div className={styles.stockFill} style={{ width: '75%' }} />
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={styles.buyBtn}
                    >
                      Mua ngay
                    </button>
                  </div>

                  {/* Vòng lặp nhấp nháy */}
                  <div className={styles.pulseRing}>
                    <div className={styles.pulseInner} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;