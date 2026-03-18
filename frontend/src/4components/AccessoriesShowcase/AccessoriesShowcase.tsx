import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// Kiểm tra lại đường dẫn import tùy vào cấu trúc thư mục
import { productService, type Product } from '../../1services/product.service';
import { cartService } from '../../1services/cart.service';
import { useAuth } from '../../2context/AuthContext';
import { useCart } from '../../2context/CartContext'; // Cập nhật số lượng giỏ hàng trên Header
import { toast } from 'react-toastify';
import styles from './AccessoriesShowcase.module.css';

const AccessoriesShowcase = () => {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart(); // Lấy hàm update giỏ hàng ra

  // Lấy đường dẫn Base URL từ môi trường thay vì fix cứng localhost
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      setLoading(true);
      // Giả lập gọi API lấy 6 phụ kiện (có thể đổi logic tùy API Backend)
      const response = await productService.getProducts(3, 6, '', '');
      setAccessories(response.data);
    } catch (error) {
      console.error('Lỗi tải danh sách phụ kiện:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  // Format tiền tệ VNĐ
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Chặn sự kiện click nhầm vào Card để chuyển trang
    
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng');
      navigate('/login');
      return;
    }
    
    try {
      await cartService.addToCart(product.id, 1);
      toast.success(`Đã thêm ${product.title} vào giỏ hàng`);
      fetchCart(); // Gọi hàm tải lại giỏ hàng để số trên Header nhảy lên
    } catch (error) {
      console.error('Lỗi thêm giỏ hàng:', error);
      toast.error('Thêm vào giỏ hàng thất bại');
    }
  };

  if (loading) {
    return null; // Không render gì nếu đang tải (hoặc có thể thay bằng bộ xương (skeleton))
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* --- Tiêu đề Khu Vực --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.headerBox}
        >
          <h2 className={styles.title}>
            Phụ kiện đi kèm
          </h2>
          <p className={styles.subtitle}>
            Hoàn thiện trải nghiệm của bạn
          </p>
        </motion.div>

        {/* --- Lưới Sản Phẩm --- */}
        <div className={styles.grid}>
          {accessories.map((accessory, index) => {
            // Cứ mỗi 7 sản phẩm thì ô đầu tiên sẽ to gấp đôi (featured)
            const isFeatured = index % 7 === 0;
            const price = typeof accessory.price === 'string' ? parseFloat(accessory.price) : accessory.price;

            return (
              <motion.div
                key={accessory.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/products/${accessory.id}`)}
                className={`${styles.cardWrapper} ${isFeatured ? styles.featuredCard : ''}`}
              >
                <div className={styles.cardInner}>
                  
                  {/* Khung ảnh */}
                  <div className={`${styles.imageBox} ${isFeatured ? styles.aspectSquare : styles.aspectRect}`}>
                    {accessory.image_url ? (
                      <img
                        src={getImageUrl(accessory.image_url)}
                        alt={accessory.title}
                        className={styles.productImg}
                      />
                    ) : (
                      <div className={styles.noImageText}>Chưa có ảnh</div>
                    )}
                  </div>

                  {/* Khung Thông tin */}
                  <div className={styles.infoBox}>
                    <h3 className={styles.productTitle}>
                      {accessory.title}
                    </h3>
                    
                    <div className={styles.priceRow}>
                      <span className={styles.priceText}>
                        {formatCurrency(price)}
                      </span>
                      
                      {/* Nút Thêm Nhanh (Hiện khi hover) */}
                      <button
                        onClick={(e) => handleAddToCart(e, accessory)}
                        className={styles.addBtn}
                        title="Thêm vào giỏ"
                      >
                        <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Hiệu ứng viền nhấp nháy khi di chuột */}
                  <div className={styles.hoverBorder} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* --- Nút Xem Tất Cả --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.viewAllBox}
        >
          <button
            onClick={() => navigate('/accessories')}
            className={styles.viewAllBtn}
          >
            <span>Xem tất cả phụ kiện</span>
            <svg className={styles.viewAllIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default AccessoriesShowcase;