# MobiTechPro - E-commerce Platform

MobiTechPro là một nền tảng thương mại điện tử hiện đại, chuyên cung cấp các sản phẩm công nghệ. Dự án được xây dựng với kiến trúc Fullstack, sử dụng các công nghệ tiên tiến nhất hiện nay để đảm bảo hiệu năng và trải nghiệm người dùng.

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

### Backend
-   **Ngôn ngữ:** TypeScript
-   **Framework:** Node.js, Express.js
-   **Database:** PostgreSQL (sử dụng TypeORM để quản lý)
-   **Authentication:** JWT (JSON Web Token), Bcrypt (mã hóa mật khẩu)
-   **Modules:** Modular Architecture (Auth, Users, Products, Orders, Cart, Reviews)

### Frontend
-   **Framework:** React (Vite)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS (Modern, Responsive Design)
-   **State Management:** React Context API (Auth Context)
-   **Routing:** React Router DOM (v6)
-   **HTTP Client:** Axios (với Interceptors xử lý Token)

## ✨ Tính Năng Đã Triển Khai (Features)

### 1. Phân Quyền & Xác Thực (Auth & RBAC)
-   [x] Đăng ký / Đăng nhập (JWT).
-   [x] Phân quyền người dùng: **Admin** (Quản trị), **Staff** (Nhân viên), **Customer** (Khách hàng).
-   [x] Bảo vệ Route (Protected Routes) dựa trên vai trò.
-   [x] Xử lý phiên đăng nhập hết hạn (Auto Logout).

### 2. Sản Phẩm (Products)
-   [x] Xem danh sách sản phẩm (Pagination, Filter theo giá/danh mục, Search).
-   [x] Xem chi tiết sản phẩm.
-   [x] Đánh giá & Bình luận sản phẩm (Product Reviews & Ratings).
-   [x] **Admin:** Thêm, Sửa, Xóa sản phẩm, Up ảnh.

### 3. Giỏ Hàng & Đặt Hàng (Cart & Checkout)
-   [x] Thêm vào giỏ hàng.
-   [x] Xem giỏ hàng, cập nhật số lượng, xóa sản phẩm.
-   [x] Thanh toán (Checkout) -> Tạo đơn hàng tự động.
-   [x] Xóa giỏ hàng sau khi đặt thành công.

### 4. Quản Lý Đơn Hàng (Order Management)
-   [x] **Customer:** Xem lịch sử đơn hàng (**My Orders**), theo dõi trạng thái.
-   [x] **Staff/Admin:** Quản lý tất cả đơn hàng (**Order Management**).
-   [x] **Staff/Admin:** Cập nhật trạng thái đơn (Processing, Shipped, Completed, Cancelled).
-   [x] **Admin:** Xóa đơn hàng.

### 5. Người Dùng (User Profile)
-   [x] Xem & Chỉnh sửa thông tin cá nhân.
-   [x] Đổi mật khẩu.
-   [x] **Admin:** Quản lý danh sách người dùng, phân quyền.

## 📂 Cấu Trúc Thư Mục (Project Structure)

```
MobiTechPro/
├── backend/                 # Mã nguồn Backend
│   ├── src/
│   │   ├── config/          # Cấu hình DB, Environment
│   │   ├── modules/         # Các module chức năng chính
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── cart/        # Giỏ hàng
│   │   │   ├── orders/      # Đơn hàng
│   │   │   ├── products/    # Sản phẩm
│   │   │   ├── reviews/     # Đánh giá
│   │   │   └── users/       # Người dùng
│   │   └── app.ts           # Entry point
│
├── frontend/                # Mã nguồn Frontend
│   ├── src/
│   │   ├── components/      # UI Components tái sử dụng (Header, Button, etc.)
│   │   ├── context/         # AuthContext
│   │   ├── layouts/         # MainLayout, AdminLayout
│   │   ├── pages/           # Các trang màn hình
│   │   │   ├── admin/       # Dashboard & Quản lý (Products, Orders, Users)
│   │   │   ├── CartPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── MyOrdersPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── services/        # API Services (Axios calls)
│   │   └── main.tsx         # Entry point
```

## 🛠 Hướng Dẫn Cài Đặt (Setup Guide)

### 1. Backend
```bash
cd backend
npm install
# Cấu hình file .env (DB_HOST, DB_PASS, JWT_SECRET...)
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Project is ready to run! 🚀
