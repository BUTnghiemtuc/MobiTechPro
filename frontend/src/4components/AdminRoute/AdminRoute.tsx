import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../2context/AuthContext';
import styles from './AdminRoute.module.css';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Đã đăng nhập VÀ có quyền admin -> Cho phép đi tiếp
  if (isAuthenticated && user?.role === 'admin') {
    return <Outlet />;
  }

  // Đã đăng nhập nhưng KHÔNG phải admin -> Báo lỗi Access Denied
  if (isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Truy cập bị từ chối</h1>
          <p className={styles.message}>Bạn không có quyền xem trang này.</p>
          <p className={styles.details}>
            Quyền hiện tại: <span className={styles.roleHighlight}>{user?.role || 'Không xác định'}</span><br/>
            Quyền yêu cầu: <span className={styles.roleHighlight}>admin</span>
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

export default AdminRoute;