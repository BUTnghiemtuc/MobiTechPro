import { useState, useEffect } from 'react';
import { useAuth } from '../../2context/AuthContext';
import api from '../../1services/api';
import { toast } from 'react-toastify';
import styles from './UserManagement.module.css';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success(`User "${username}" deleted successfully`);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
        <div className={styles.div_1}>
          <div className={styles.div_2}></div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className={styles.div_3}>
        <div>
           <h1 className={styles.h1_1}>User Management</h1>
           <p className={styles.p_1}>View and manage system users</p>
        </div>
      </div>

      <div className={styles.div_4}>
        <div className="overflow-x-auto">
        <table className={styles.table_1}>
          <thead className="bg-slate-50/50">
            <tr>
              <th className={styles.th_1}>
                ID
              </th>
              <th className={styles.th_1}>
                User
              </th>
              <th className={styles.th_1}>
                Email
              </th>
              <th className={styles.th_1}>
                Role
              </th>
              <th className={styles.th_1}>
                Joined Date
              </th>
              <th className={styles.th_2}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={styles.tbody_1}>
            {users.map((user) => (
              <tr key={user.id} className={styles.tr_1}>
                <td className={styles.td_1}>
                  #{user.id}
                </td>
                <td className={styles.td_2}>
                   <div className={styles.div_5}>
                        <div className={styles.div_6}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.div_7}>{user.username}</div>
                   </div>
                </td>
                <td className={styles.td_2}>
                  <div className={styles.div_8}>{user.email}</div>
                </td>
                <td className={styles.td_2}>
                  <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'Staff' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className={styles.td_3}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className={styles.td_4}>
                  {user.id !== Number(currentUser?.id) ? (
                    <button
                      onClick={() => handleDeleteUser(user.id, user.username)}
                      className={`${styles.el_1} group`}
                      title="Delete User"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  ) : (
                    <span className={styles.span_1}>Current User</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className={styles.div_9}>
            <p>No users found</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
