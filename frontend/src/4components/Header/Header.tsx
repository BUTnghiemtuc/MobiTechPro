import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../2context/AuthContext';
import { useCart } from '../../2context/CartContext';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = (location.pathname + location.search) === to;

  return (
    <Link 
      to={to} 
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="navbar-underline"
          className={styles.navUnderline}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </Link>
  );
};

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalQuantity } = useCart();
  
  // GỠ BOM: Thêm navigate để chuyển trang khi ấn tìm kiếm
  const navigate = useNavigate();

  // Bắt sự kiện cuộn trang để đổi màu nền Header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hàm xử lý khi gõ tìm kiếm và nhấn Enter
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/phones?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Xóa nội dung sau khi search
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : styles.top}`}>
      <div className={styles.container}>
        
        {/* Logo */}
        <Link to="/" className={styles.logoLink}>
          <div className={styles.logoIcon}>M</div>
          <span className={styles.logoText}>MobiTechPro</span>
        </Link>

        {/* Menu Điều hướng */}
        <nav className={styles.navMenu}>
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/phones">Điện thoại</NavLink>
          <NavLink to="/phones?search=Accessories">Phụ kiện</NavLink>
          <NavLink to="/blog">Góc công nghệ</NavLink>
          <NavLink to="/contact">Tư vấn</NavLink>
        </nav>

        {/* Thanh tìm kiếm */}
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit} 
          />
        </div>

        {/* Cụm Nút bấm chức năng */}
        <div className={styles.actions}>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className={styles.loginBtn}>Đăng nhập</Link>
              <Link to="/register" className={styles.signupBtn}>Đăng ký</Link>
            </>
          ) : (
            <div className={styles.userMenu}>
               
               {/* Dropdown Hồ sơ User */}
               <div className={styles.profileGroup}>
                    <button className={styles.profileBtn}>
                        <div className={styles.profileInfo}>
                            <p className={styles.profileName}>{user?.username}</p>
                            <p className={styles.profileRole}>
                                {user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'staff' ? 'Nhân viên' : 'Thành viên'}
                            </p>
                        </div>
                        <div className={styles.avatarWrapper}>
                             {user?.avatar_url ? (
                                <img src={user.avatar_url} alt="Avatar" className={styles.avatarImg} />
                             ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {user?.username.charAt(0).toUpperCase()}
                                </div>
                             )}
                        </div>
                    </button>
                    
                    {/* Menu thả xuống */}
                    <div className={styles.dropdown}>
                        <div className={styles.dropdownList}>
                            <Link to="/profile" className={styles.dropdownItem}>Hồ sơ của tôi</Link>
                            <Link to="/my-orders" className={styles.dropdownItem}>Lịch sử đơn hàng</Link>
                            
                            {(user?.role === 'admin' || user?.role === 'staff') && (
                                <Link to="/admin" className={styles.dropdownItem}>Bảng Quản trị</Link>
                            )}
                            
                            <div className={styles.dropdownDivider}></div>
                            <button onClick={logout} className={styles.dropdownLogout}>
                                Đăng xuất
                            </button>
                        </div>
                    </div>
               </div>

              {/* Icon Giỏ hàng */}
              <Link to="/cart" className={styles.cartBtn}>
                 <div className={styles.cartIconWrapper}>
                    <svg className={styles.cartIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                 </div>
                 {/* Chỉ hiện cục đỏ đếm số khi có hàng trong giỏ */}
                 {totalQuantity > 0 && (
                    <div className={styles.cartBadge}>{totalQuantity}</div>
                 )}
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
export default Header;