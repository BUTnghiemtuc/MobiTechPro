
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import PhonePage from './pages/PhonePage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderManagement from './pages/admin/OrderManagement';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import ProductEditor from './pages/admin/ProductEditor';
import UserManagement from './pages/admin/UserManagement';
import BrandManagement from './pages/admin/BrandManagement';
import BrandPage from './pages/BrandPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MainLayout from './layouts/MainLayout';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './components/PolicyPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Header */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/phones" element={<PhonePage />} />
            <Route path="/phones/:keyword" element={<PhonePage />} />
            <Route path="/brand/:brandName" element={<BrandPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PolicyPage title="Privacy Policy" lastUpdated="February 4, 2026" />} />
            <Route path="/terms-of-service" element={<PolicyPage title="Terms of Service" lastUpdated="February 4, 2026" />} />
            <Route path="/shipping-policy" element={<PolicyPage title="Shipping Policy" lastUpdated="February 4, 2026" />} />
            <Route path="/returns-refunds" element={<PolicyPage title="Returns & Refunds Policy" lastUpdated="February 4, 2026" />} />
            <Route path="/profile" element={
                 <ProtectedRoute allowedRoles={['Customer', 'Staff', 'Admin']}>
                     <ProfilePage />
                 </ProtectedRoute>
            } />
            <Route path="/my-orders" element={
                 <ProtectedRoute allowedRoles={['Customer', 'Staff', 'Admin']}>
                     <MyOrdersPage />
                 </ProtectedRoute>
            } />
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Admin Routes - Admin and Staff */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/new" element={<ProductEditor />} />
            <Route path="products/:id" element={<ProductEditor />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="brands" element={<BrandManagement />} />
            {/* Admin-only route for User Management */}
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
