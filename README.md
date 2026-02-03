# MobiTechPro - Nền Tảng Thương Mại Điện Tử

Chào mừng đến với repository chính thức của **MobiTechPro**. Đây là một giải pháp thương mại điện tử Full-stack hiện đại, phục vụ nhu cầu mua sắm thiết bị công nghệ trực tuyến.

Dự án này được tổ chức theo mô hình **Monorepo**, bao gồm mã nguồn cho cả Frontend (Giao diện người dùng) và Backend (API & Server).

## 🏗️ Kiến Trúc Hệ Thống

Dự án được chia thành hai phần chính:

### 1. [Frontend](./frontend)
*   **Vị trí**: `/frontend`
*   **Nhiệm vụ**: Xây dựng giao diện người dùng tương tác, hiển thị sản phẩm, giỏ hàng và thanh toán.
*   **Công nghệ**: React, TypeScript, Vite, Tailwind CSS, Axios.

### 2. [Backend](./backend)
*   **Vị trí**: `/backend`
*   **Nhiệm vụ**: Cung cấp RESTful API, quản lý cơ sở dữ liệu, xác thực người dùng và xử lý nghiệp vụ.
*   **Công nghệ**: Node.js, Express, TypeScript, TypeORM, PostgreSQL.

## 📂 Cấu Trúc Thư Mục

```text
MobiTechPro/
├── frontend/        # Mã nguồn Client-side (ReactJS)
│   ├── src/
│   ├── public/
│   └── README.md    # Hướng dẫn chi tiết cho Frontend
├── backend/         # Mã nguồn Server-side (NodeJS)
│   ├── src/
│   └── README.md    # Hướng dẫn chi tiết cho Backend (To be added)
└── README.md        # Tài liệu tổng quan (File này)
```

## 🚀 Hướng Dẫn Nhanh (Quick Start)

Để chạy toàn bộ dự án trên máy local, bạn cần mở hai terminal riêng biệt:

**Terminal 1: Chạy Backend**
```bash
cd backend
npm install
npm run dev
# Server sẽ chạy tại: http://localhost:3000
```

**Terminal 2: Chạy Frontend**
```bash
cd frontend
npm install
npm run dev
# Website sẽ chạy tại: http://localhost:5173
```

## 📝 Tài Liệu Chi Tiết

Vui lòng tham khảo file `README.md` bên trong từng thư mục con để biết thêm chi tiết về cách cài đặt, cấu hình môi trường (.env) và các lệnh script cụ thể:

*   [Xem Hướng dẫn Frontend](./frontend/README.md)
*   [Xem Hướng dẫn Backend](./backend/README.md)

---
© 2024 MobiTechPro Team. All rights reserved.
