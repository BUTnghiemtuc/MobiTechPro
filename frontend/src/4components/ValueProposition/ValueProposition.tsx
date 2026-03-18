import { motion } from 'framer-motion';
import styles from './ValueProposition.module.css';

const ValueProposition = () => {
  const benefits = [
    {
      icon: (
        <svg className={styles.svgIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Giao hàng hỏa tốc 2h',
      description: 'Nhận hàng nhanh chóng'
    },
    {
      icon: (
        <svg className={styles.svgIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Bảo hành chính hãng 12 tháng',
      description: 'Yên tâm sử dụng'
    },
    {
      icon: (
        <svg className={styles.svgIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: 'Trả góp 0% lãi suất',
      description: 'Mua trước trả sau'
    },
    {
      icon: (
        <svg className={styles.svgIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: '1 đổi 1 trong 30 ngày',
      description: 'Đổi trả dễ dàng'
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={styles.itemWrapper}
            >
              {/* Vùng chứa Icon */}
              <div className={styles.iconContainer}>
                <div className={styles.iconBox}>
                  {benefit.icon}
                </div>
              </div>

              {/* Vùng chứa nội dung Text */}
              <div>
                <h3 className={styles.title}>
                  {benefit.title}
                </h3>
                <p className={styles.description}>
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;