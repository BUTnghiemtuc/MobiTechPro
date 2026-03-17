import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../2context/AuthContext';
import styles from './StaffRoute.module.css';

const StaffRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Đã đăng nhập VÀ có quyền staff 
  if (isAuthenticated && user?.role === 'staff') {
    return <Outlet />;
  }

  // Đã đăng nhập nhưng KHÔNG phải staff -> Báo lỗi Access Denied
  if (isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Truy cập bị từ chối</h1>
          <p className={styles.message}>Bạn không có quyền xem trang này dành cho Nhân viên.</p>
          <p className={styles.details}>
            Quyền hiện tại: <span className={styles.roleHighlight}>{user?.role || 'Không xác định'}</span><br/>
            Quyền yêu cầu: <span className={styles.roleHighlight}>staff</span>
          </p>
          
          <Link to="/" className={styles.homeButton}>
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> Đá về trang Login
  return <Navigate to="/login" replace />;
};

export default StaffRoute;