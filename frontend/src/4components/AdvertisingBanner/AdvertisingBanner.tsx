import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './AdvertisingBanner.module.css';

interface AdvertisingBannerProps {
  campaign?: 'gaming' | 'ecosystem';
}

const AdvertisingBanner = ({ campaign = 'gaming' }: AdvertisingBannerProps) => {
  const campaigns = {
    gaming: {
      title: 'Gaming Phone',
      subtitle: 'Hiệu năng đỉnh cao',
      description: 'Trải nghiệm chơi game mượt mà với chip xử lý mạnh mẽ và màn hình 144Hz',
      buttonText: 'Khám phá ngay',
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
      gradientClass: styles.gradientGaming, // Gỡ bom lỗi Tailwind class động
      link: '/phones?search=gaming'
    },
    ecosystem: {
      title: 'Hệ sinh thái hoàn hảo',
      subtitle: 'Kết nối mọi thiết bị',
      description: 'Đồng hồ thông minh, tai nghe không dây và nhiều hơn nữa. Tất cả kết nối liền mạch.',
      buttonText: 'Xem bộ sưu tập',
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      gradientClass: styles.gradientEcosystem,
      link: '/phones?search=Accessories' // Sửa link cho khớp API
    }
  };

  const data = campaigns[campaign];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${styles.bannerCard} ${data.gradientClass}`}
        >
          <div className={styles.grid}>
            
            {/* Cột trái: Nội dung */}
            <div className={styles.contentArea}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className={styles.subtitleBadge}>
                  {data.subtitle}
                </span>
                <h2 className={styles.title}>
                  {data.title}
                </h2>
                <p className={styles.description}>
                  {data.description}
                </p>
                <Link to={data.link} className={styles.ctaBtn}>
                  <span>{data.buttonText}</span>
                  <svg className={styles.arrowIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Cột phải: Hình ảnh */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={styles.imageArea}
            >
              <img
                src={data.image}
                alt={data.title}
                className={styles.heroImage}
              />
              {/* Lớp phủ mờ màu gradient */}
              <div className={`${styles.overlay} ${data.gradientClass}`} />
            </motion.div>
          </div>

          {/* Các mảng màu trang trí sau nền (Decor) */}
          <div className={styles.decorTopRight} />
          <div className={styles.decorBottomLeft} />
        </motion.div>
      </div>
    </section>
  );
};

export default AdvertisingBanner;