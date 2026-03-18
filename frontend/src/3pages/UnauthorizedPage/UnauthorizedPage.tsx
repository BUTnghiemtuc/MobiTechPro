import { Link } from 'react-router-dom';
import { useAuth } from '../../2context/AuthContext';
import styles from './UnauthorizedPage.module.css';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className={styles.div_1}>
      <div className={styles.div_2}>
        <div className="mb-6">
          <svg
            className={styles.svg_1}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className={styles.h1_1}>
          Access Denied
        </h1>
        
        <p className={styles.p_1}>
          Bạn không có quyền truy cập trang này.
        </p>
        
        {user && (
          <p className={styles.p_2}>
            Current Role: <span className={styles.span_1}>{user.role}</span>
          </p>
        )}
        
        <div className="space-y-3">
          <Link
            to="/"
            className={styles.Link_1}
          >
            Go to Home
          </Link>
          <Link
            to={user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/'}
            className={styles.Link_2}
          >
            {user?.role === 'admin' && 'Go to Admin Dashboard'}
            {user?.role === 'staff' && 'Go to Staff Dashboard'}
            {user?.role === 'customer' && 'Continue Shopping'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
