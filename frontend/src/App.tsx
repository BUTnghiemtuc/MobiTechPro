
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './3pages/HomePage/HomePage';
import PhonePage from '../src/3pages/PhonePage/PhonePage';
import LoginPage from './3pages/LoginPage/LoginPage';
import CartPage from '../src/3pages/CartPage/CartPage';
import RegisterPage from './3pages/RegisterPage/RegisterPage';
import ProductDetailPage from '../src/3pages/ProductDetailPage/ProductDetailPage';
import ProfilePage from '../src/3pages/ProfilePage/ProfilePage';
import MyOrdersPage from '../src/3pages/MyOrdersPage/MyOrdersPage';
import OrderManagement from './3pages/admin/OrderManagement';
import { AuthProvider } from './2context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './4components/ProtectedRoute/ProtectedRoute';
import AdminLayout from './4components/layouts/AdminLayout';
import AdminDashboard from './3pages/admin/AdminDashboard';
import ProductManagement from './3pages/admin/ProductManagement';
import ProductEditor from './3pages/admin/ProductEditor';
import UserManagement from './3pages/admin/UserManagement';
import BrandManagement from './3pages/admin/BrandManagement';
import BrandPage from '../src/3pages/BrandPage/BrandPage';
import UnauthorizedPage from './3pages/UnauthorizedPage/UnauthorizedPage';
import MainLayout from './4components/layouts/MainLayout';
import AboutPage from './3pages/AboutPage/AboutPage';
import ContactPage from './3pages/ContactPage/ContactPage';
import PolicyPage from './4components/PolicyPage/PolicyPage';
import BlogListPage from '../src/3pages/BlogListPage/BlogListPage';
import BlogDetailPage from '../src/3pages/BlogDetailPage/BlogDetailPage';
import BlogManagement from './3pages/admin/BlogManagement';
import BlogEditor from './3pages/admin/BlogEditor';
import CheckoutPage from './3pages/checkout/CheckoutPage';
import OrderSuccessPage from './3pages/checkout/OrderSuccessPage';
import { CartProvider } from './2context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<OrderSuccessPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              <Route path="/privacy-policy" element={<PolicyPage title="Privacy Policy" lastUpdated="February 4, 2026" />} />
              <Route path="/terms-of-service" element={<PolicyPage title="Terms of Service" lastUpdated="February 4, 2026" />} />
              <Route path="/shipping-policy" element={<PolicyPage title="Shipping Policy" lastUpdated="February 4, 2026" />} />
              <Route path="/returns-refunds" element={<PolicyPage title="Returns & Refunds Policy" lastUpdated="February 4, 2026" />} />
              
              {/* GỠ BOM: Hạ chữ thường cho Role */}
              <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                      <ProfilePage />
                  </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                  <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
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
                /* GỠ BOM: Hạ chữ thường cho Role */
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
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
              <Route path="blog" element={<BlogManagement />} />
              <Route path="blog/new" element={<BlogEditor />} />
              <Route path="blog/:id/edit" element={<BlogEditor />} />
              
              {/* Admin-only route for User Management */}
              <Route
                path="users"
                element={
                  /* GỠ BOM: Hạ chữ thường cho Role */
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </CartProvider> 
    </AuthProvider>
  );
}

export default App;
