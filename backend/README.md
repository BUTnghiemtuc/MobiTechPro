# MobiTechPro Backend

Đây là source code Backend cho dự án E-commerce MobiTechPro, được xây dựng bằng **Node.js**, **Express**, **TypeScript** và **PostgreSQL** (TypeORM).

## 🛠 Yêu cầu hệ thống

- **Node.js**: v14 trở lên
- **PostgreSQL**: Đã cài đặt và đang chạy
- **npm** hoặc **yarn**

## 🚀 Hướng dẫn Cài đặt

### 1. Clone dự án
```bash
git clone <link-repo-cua-ban>
cd MobiTechPro/backend
```

### 2. Cài đặt thư viện
```bash
npm install
```

### 3. Cấu hình Env
Tạo file `.env` tại thư mục gốc `backend/` và điền thông tin cấu hình database của bạn:

```env
# Server
PORT=3000

# Database Config
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=BTL_TMDT

# JWT Security
JWT_SECRET=Thay_Doi_Chuoi_Nay_Cho_Bao_Mat_Nhe_!!!
JWT_EXPIRES_IN=1d
```
> **Lưu ý:** Bạn cần tạo trước database rỗng tên `BTL_TMDT` (hoặc tên tùy ý) trong PostgreSQL trước khi chạy code.

### 4. Chạy dự án (Development)
Chạy server với chế độ hot-reload (tự động restart khi sửa code):
```bash
npm run dev
```
Server sẽ chạy tại: `http://localhost:3000`

### 5. Build và Chạy (Production)
```bash
npm run build
npm start
```

## 🗄 Cấu trúc Database
Khi chạy lần đầu, TypeORM (`synchronize: true`) sẽ tự động tạo các bảng sau:
- `Users`: Người dùng
- `Products`: Sản phẩm
- `Tags`: Thẻ sản phẩm
- `Cart`: Giỏ hàng
- `Orders`: Đơn hàng
- `Order_Items`: Chi tiết đơn hàng
- `Ads`: Quảng cáo/Banner

## 📝 API Endpoints Chính
- `POST /api/auth/register`: Đăng ký
- `POST /api/auth/login`: Đăng nhập
- `GET /api/orders`: Danh sách đơn hàng
- `POST /api/orders`: Tạo đơn hàng mới
