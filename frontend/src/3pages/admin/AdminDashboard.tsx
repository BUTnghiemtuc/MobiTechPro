import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { orderService } from '../../1services/order.service';
import { toast } from 'react-toastify';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState<{
    revenue: number;
    totalOrders: number;
    totalProducts: number;
    statusDistribution: { name: string; count: number; color: string }[];
    revenueTrend: { name: string; revenue: number }[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await orderService.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      console.error("Failed to fetch stats:", error);
      
      // Provide specific error messages
      if (error.response?.status === 401) {
        toast.error("Phi\u00ean làm việc hết hạn. Vui lòng đăng nhập lại");
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền xem thống kê");
      } else {
        toast.error("Không thể tải thống kê dashboard");
      }
      
      // Set default/empty stats to prevent UI from breaking
      setStats({
        revenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        statusDistribution: [],
        revenueTrend: []
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtext, icon, color, gradient }: any) => (
    <div className={`${styles.div_1} group`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
      <div className={styles.div_2}>
        <div>
          <p className={styles.p_1}>{title}</p>
          <h3 className={styles.h3_1}>{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100 shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className={styles.div_3}>
        <span className={styles.span_1}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {subtext}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.div_4}>
        <div className={styles.div_5}></div>
      </div>
    );
  }

  // Fallback if stats is null (should normally not happen after loading)
  if (!stats) return <div className={styles.div_6}>No data available</div>;

  return (
    <div className={styles.div_7}>
      {/* Header */}
      <div className={styles.div_8}>
        <div>
           <h1 className={styles.h1_1}>Dashboard Overview</h1>
           <p className={styles.p_2}>Real-time insights into your store's performance.</p>
        </div>
        <div className={styles.div_9}>
            <span className={styles.span_2}>Today</span>
            <span className={styles.span_3}>7 Days</span>
            <span className={styles.span_3}>30 Days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.div_10}>
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.revenue.toLocaleString()}`}
          subtext="Lifetime earnings"
          color="bg-blue-500 text-blue-600"
          gradient="from-blue-400 to-blue-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>}
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders}
          subtext="Orders processed"
          color="bg-indigo-500 text-indigo-600"
          gradient="from-indigo-400 to-indigo-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>}
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          subtext="In inventory"
          color="bg-emerald-500 text-emerald-600"
          gradient="from-emerald-400 to-emerald-600"
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>}
        />
      </div>

      {/* Charts Section */}
      <div className={styles.div_11}>
        {/* Revenue Chart */}
        <div className={styles.div_12}>
           <div className={styles.div_13}>
               <h3 className={styles.h3_2}>Revenue Trend</h3>
               <select className={styles.select_1}>
                   <option>Last 7 Days</option>
               </select>
           </div>
           
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stats.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} tickFormatter={(val) => `$${val}`} />
                 <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                 />
                 <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Orders Overview */}
        <div className={styles.div_12}>
           <h3 className={styles.h3_3}>Order Status Distribution</h3>
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={stats.statusDistribution} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }} barSize={36}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                 <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                 <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: 600}} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className={styles.h3_4}>Quick Actions</h3>
        <div className={styles.div_14}>
          <Link to="/admin/products/new" className={styles.Link_1}>
             <div className={styles.div_15}></div>
             <div className={styles.div_16}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
             </div>
             <div>
                <span className={styles.span_4}>Add Product</span>
                <span className={styles.span_5}>Create new listing</span>
             </div>
          </Link>
          
          <Link to="/admin/orders" className={`${styles.Link_2} group relative overflow-hidden`}>
             <div className={styles.div_17}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
             </div>
             <div>
                <span className={styles.span_6}>Manage Orders</span>
                <span className={styles.span_7}>Review incoming orders</span>
             </div>
          </Link>

          <Link to="/admin/users" className={`${styles.Link_3} group relative overflow-hidden`}>
             <div className={styles.div_18}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
             </div>
             <div>
                <span className={styles.span_8}>Users</span>
                <span className={styles.span_7}>Manage accounts</span>
             </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
