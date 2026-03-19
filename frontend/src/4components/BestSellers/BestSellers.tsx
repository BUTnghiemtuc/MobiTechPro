import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { productService, type Product } from '../../1services/product.service';
import { cartService } from '../../1services/cart.service';
import { useAuth } from '../../2context/AuthContext';
import { useCart } from '../../2context/CartContext';
import { formatPrice } from '../../2utils/format';
import { toast } from 'react-toastify';
import styles from './BestSellers.module.css';

const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart(); // Lấy hàm tải lại giỏ hàng

  // Dùng biến môi trường
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      // Lấy 8 sản phẩm đầu tiên làm "Best Sellers"
      const response = await productService.getProducts(1, 8, '', '');
      setProducts(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bán chạy:', error);
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
    e.stopPropagation(); // Ngăn click nhầm vào div cha
    
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    
    try {
      await cartService.addToCart(product.id, 1);
      toast.success(`Đã thêm ${product.title} vào giỏ hàng`);
      fetchCart(); // Cập nhật số trên icon giỏ hàng
    } catch (error) {
      console.error('Lỗi thêm vào giỏ:', error);
      toast.error('Thêm vào giỏ hàng thất bại');
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.loaderBox}>Đang tải...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* --- Header Khối --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.headerBox}
        >
          <h2 className={styles.title}>
            Sản phẩm Bán chạy
          </h2>
          <p className={styles.subtitle}>
            Những sản phẩm được yêu thích nhất
          </p>
        </motion.div>

        {/* --- Lưới Sản Phẩm --- */}
        <div className={styles.grid}>
          {products.map((product, index) => {
            const priceStr = product.price.toString();
            const currentPrice = parseFloat(priceStr);
            const originalPrice = currentPrice * 1.2; // Giả lập giá gốc cao hơn 20%

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/products/${product.id}`)}
                className={styles.cardWrapper}
              >
                {/* Glassmorphism Card */}
                <div className={styles.glassCard}>
                  
                  {/* Khung Ảnh */}
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
                    
                    {/* Gradient Overlay */}
                    <div className={styles.gradientOverlay} />
                  </div>

                  {/* Khung Thông Tin */}
                  <div className={styles.infoBox}>
                    <h3 className={styles.productTitle}>
                      {product.title}
                    </h3>
                    
                    {/* Giá tiền */}
                    <div className={styles.priceRow}>
                      <span className={styles.salePrice}>
                        {formatPrice(currentPrice)}
                      </span>
                      <span className={styles.originalPrice}>
                        {formatPrice(originalPrice)}
                      </span>
                    </div>

                    {/* Nút Thêm vào giỏ */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={styles.addBtn}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>

                  {/* Hiệu ứng Shine xẹt sáng qua khi hover */}
                  <div className={styles.shineEffect}>
                    <div className={styles.shineGradient} />
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

export default BestSellers;