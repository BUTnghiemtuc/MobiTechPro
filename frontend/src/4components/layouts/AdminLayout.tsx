import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../2context/AuthContext';
import { useState } from 'react';
import styles from './AdminLayout.module.css';

const Icons = {
  Dashboard: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Products: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
  Orders: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
  Brands: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>,
  Blog: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
  Users: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Back: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
  Logout: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  Menu: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
};

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? styles.navItemActive : styles.navItemInactive;
  };

  const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <Link to={to} className={`${styles.navItem} ${isActive(to)}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className={styles.layoutWrapper}>
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>M</div>
          <div>
            <h1 className={styles.logoTitle}>MobiTechPro</h1>
            <p className={styles.logoSubtitle}>
               {user?.role === 'admin' ? 'Quản Trị Viên' : 'Nhân Viên'}
            </p>
          </div>
        </div>
          
        <nav className={styles.navContainer}>
          <p className={styles.navSectionTitle}>Tổng quan</p>
          <NavItem to="/admin" label="Bảng điều khiển" icon={Icons.Dashboard} />
            
          <p className={styles.navSectionTitle}>Quản lý Cửa hàng</p>
          <NavItem to="/admin/products" label="Sản phẩm" icon={Icons.Products} />
          <NavItem to="/admin/orders" label="Đơn hàng" icon={Icons.Orders} />
          <NavItem to="/admin/brands" label="Thương hiệu" icon={Icons.Brands} />
          <NavItem to="/admin/blog" label="Bài viết Blog" icon={Icons.Blog} />
            
          {user?.role === 'admin' && (
            <>
               <p className={styles.navSectionTitle}>Quản trị Hệ thống</p>
               <NavItem to="/admin/users" label="Người dùng" icon={Icons.Users} />
            </>
          )}

          <div className={styles.navDivider}>
             <NavItem to="/" label="Về trang cửa hàng" icon={Icons.Back} />
          </div>
        </nav>

        <div className={styles.userFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
               {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
               <p className={styles.userName}>{user?.username}</p>
               <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            {Icons.Logout} Đăng xuất
          </button>
        </div>
      </aside>

      <div className={styles.mainWrapper}>
        
        <header className={styles.mobileHeader}>
           <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={styles.mobileMenuBtn}>
             {Icons.Menu}
           </button>
           <h1 className={styles.mobileTitle}>MobiTechPro</h1>
           <div style={{ width: '2rem' }}></div>
        </header>

        <main className={styles.contentArea}>
           <Outlet />
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
};

export default AdminLayout;