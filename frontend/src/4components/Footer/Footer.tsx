import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Cột 1: Thông tin thương hiệu */}
          <div className={styles.brandGroup}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoIcon}>M</div>
              <span className={styles.logoText}>MobiTechPro</span>
            </div>
            <p className={styles.desc}>
              Điểm đến hàng đầu cho các thiết bị công nghệ, điện thoại thông minh và phụ kiện cao cấp. Trải nghiệm tương lai ngay hôm nay.
            </p>
            <div className={styles.socials}>
              {/* Sửa lỗi lặp 4 cái icon Facebook: Dùng chữ cái đầu làm đại diện */}
              {['FB', 'TW', 'IG', 'IN'].map((social) => (
                <a key={social} href="#" className={styles.socialIcon}>
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className={styles.columnTitle}>Liên kết nhanh</h3>
            <ul className={styles.linkList}>
              <li><Link to="/" className={styles.linkItem}>Trang chủ</Link></li>
              <li><Link to="/phones" className={styles.linkItem}>Sản phẩm</Link></li>
              <li><Link to="/about" className={styles.linkItem}>Về chúng tôi</Link></li>
              <li><Link to="/contact" className={styles.linkItem}>Liên hệ</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className={styles.columnTitle}>Hỗ trợ khách hàng</h3>
            <ul className={styles.linkList}>
              <li><Link to="/contact" className={styles.linkItem}>Câu hỏi thường gặp</Link></li>
              <li><Link to="/shipping-policy" className={styles.linkItem}>Chính sách giao hàng</Link></li>
              <li><Link to="/returns-refunds" className={styles.linkItem}>Đổi trả & Hoàn tiền</Link></li>
              <li><Link to="/privacy-policy" className={styles.linkItem}>Chính sách bảo mật</Link></li>
              <li><Link to="/terms-of-service" className={styles.linkItem}>Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin */}
          <div>
            <h3 className={styles.columnTitle}>Đăng ký nhận tin</h3>
            <p className={styles.desc} style={{ marginBottom: '1rem' }}>
              Đăng ký nhận bản tin để cập nhật tin tức công nghệ và ưu đãi độc quyền.
            </p>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className={styles.input}
              />
              <button className={styles.submitBtn}>
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Thanh bản quyền dưới cùng */}
        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} MobiTechPro. Bảo lưu mọi quyền.</p>
          <div className={styles.payments}>
             {/* Placeholder cho các icon thanh toán (Visa, Master...) */}
             <div className={styles.payIcon}></div>
             <div className={styles.payIcon}></div>
             <div className={styles.payIcon}></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;