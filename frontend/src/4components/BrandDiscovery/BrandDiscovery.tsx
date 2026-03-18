import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Kiểm tra đường dẫn import tùy project
import { brandService, type Brand } from '../../1services/brand.service';
import styles from './BrandDiscovery.module.css';

const BrandDiscovery = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lấy đường dẫn API chuẩn
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await brandService.getActiveBrands();
      setBrands(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách thương hiệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const getBrandLink = (brand: Brand) => {
    return `/phones?search=${encodeURIComponent(brand.name)}`; // Sửa lại đường dẫn tìm kiếm theo Tên Hãng
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.loaderBox}>Đang tải thương hiệu...</div>
        </div>
      </section>
    );
  }

  // Một mảng mã màu fallback gradient cứng để lỡ API thiếu bgGradient
  const fallbackGradients = [
    'linear-gradient(to bottom right, #1e3a8a, #000000)', // Blue -> Black
    'linear-gradient(to bottom right, #831843, #000000)', // Pink -> Black
    'linear-gradient(to bottom right, #14532d, #000000)', // Green -> Black
    'linear-gradient(to bottom right, #4c1d95, #000000)', // Purple -> Black
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* --- Header --- */}
        <div className={styles.headerBox}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.title}
          >
            Khám Phá Thương Hiệu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={styles.subtitle}
          >
            Khám phá bộ sưu tập mới nhất từ các thương hiệu hàng đầu
          </motion.p>
        </div>
        
        {/* --- Carousel --- */}
        <div className={styles.carouselWrapper}>
          
          {/* Nút Trái */}
          <button
            onClick={() => scroll('left')}
            className={`${styles.navArrow} ${styles.arrowLeft}`}
            aria-label="Cuộn sang trái"
          >
            <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Nút Phải */}
          <button
            onClick={() => scroll('right')}
            className={`${styles.navArrow} ${styles.arrowRight}`}
            aria-label="Cuộn sang phải"
          >
            <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Khung trượt (Scrollable Track) */}
          <div ref={scrollContainerRef} className={styles.scrollTrack}>
            {brands.map((brand, index) => {
              // Xử lý an toàn cái màu nền
              const bgStyle = brand.bgGradient 
                ? { background: brand.bgGradient } // Nếu backend trả về mã hex hoặc css
                : { background: fallbackGradients[index % fallbackGradients.length] }; // Fallback an toàn
                
              return (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.cardItem}
                >
                  <Link 
                    to={getBrandLink(brand)} 
                    className={styles.cardLink}
                  >
                    {/* Background */}
                    <div className={styles.cardBgDefault} style={bgStyle}></div>
                    
                    {/* Glassmorphism overlay effect */}
                    <div className={styles.glassOverlay}></div>
                    
                    {/* Ảnh Sản Phẩm (Logo hoặc điện thoại nổi bật) */}
                    <div className={styles.imageWrapper}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className={styles.imageBox}
                      >
                         {/* Chỗ này bạn dev dùng logoUrl thay cho ảnh sản phẩm, nên mình lấy brand.logoUrl hoặc imageUrl đều được */}
                        <img 
                          src={getImageUrl(brand.imageUrl || brand.logoUrl)} 
                          alt={brand.name}
                          className={styles.mainImage}
                        />
                        {/* Glow effect */}
                        <div className={styles.glowEffect}></div>
                      </motion.div>
                    </div>

                    {/* Gradient overlay for text contrast */}
                    <div className={styles.textContrastOverlay}></div>

                    {/* Content Bên Dưới */}
                    <div className={styles.bottomContent}>
                      {/* Tag */}
                      <div className={styles.tagBadge}>
                        <div className={styles.pulsingDot}></div>
                        <span className={styles.tagText}>Bộ sưu tập mới</span>
                      </div>
                      
                      {/* Tên Hãng */}
                      <h3 className={styles.brandName}>{brand.name}</h3>
                      
                      {/* Nút Khám Phá */}
                      <div className={styles.exploreBtn}>
                        <span className={styles.exploreText}>
                          Khám Phá Ngay
                          <span className={styles.exploreUnderline}></span>
                        </span>
                        <svg viewBox="0 0 24 24" fill="none" className={styles.exploreIcon}>
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>

                    {/* Hover border effect */}
                    <div className={styles.hoverBorder}></div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandDiscovery;