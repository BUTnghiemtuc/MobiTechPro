# MobiTechPro - Frontend

Chào mừng bạn đến với repo frontend của dự án **MobiTechPro**. Đây là ứng dụng web thương mại điện tử được xây dựng bằng các công nghệ web hiện đại, tập trung vào hiệu suất và trải nghiệm người dùng.

## 🚀 Công nghệ sử dụng

Dự án này được xây dựng trên nền tảng:

*   **[React](https://react.dev/)** (v19) - Thư viện JavaScript để xây dựng giao diện người dùng.
*   **[TypeScript](https://www.typescriptlang.org/)** - Phiên bản nâng cao của JavaScript với static typing.
*   **[Vite](https://vitejs.dev/)** - Build tool thế hệ tiếp theo, cực nhanh.
*   **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework để styling nhanh chóng.
*   **[React Router](https://reactrouter.com/)** - Định tuyến cho ứng dụng SPA (Single Page Application).
*   **[Axios](https://axios-http.com/)** - HTTP client để giao tiếp với Backend API.
*   **[React Toastify](https://fkhadra.github.io/react-toastify/)** - Hiển thị thông báo (toasts) đẹp mắt.

## 📋 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

*   **Node.js**: Phiên bản 18 trở lên (khuyên dùng bản LTS mới nhất).
*   **npm** hoặc **yarn** (trình quản lý gói).

## 🛠️ Cài đặt và Chạy dự án

1.  **Di chuyển vào thư mục frontend:**

    ```bash
    cd frontend
    ```

2.  **Cài đặt các dependencies:**

    ```bash
    npm install
    ```

3.  **Khởi chạy môi trường phát triển (Development):**

    ```bash
    npm run dev
    ```

    Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173` (hoặc một cổng khác nếu 5173 đang bận).

4.  **Build cho môi trường Production:**

    ```bash
    npm run build
    ```

    Lệnh này sẽ biên dịch mã nguồn vào thư mục `dist` để deploy.

## 📂 Cấu trúc thư mục

```text
src/
├── assets/       # Chứa hình ảnh, fonts, icons tĩnh
├── components/   # Các component React tái sử dụng (Header, Footer, Button...)
├── context/      # React Context (quản lý Global State như Auth, Cart...)
├── pages/        # Các trang chính của ứng dụng (Home, Login, ProductDetail...)
├── services/     # Các hàm gọi API (AuthService, ProductService...)
├── App.tsx       # Component gốc, cấu hình routing
├── main.tsx      # Entry point của ứng dụng
└── index.css     # Global styles và cấu hình Tailwind
```

## 📜 Các Scripts có sẵn

Trong file `package.json`, bạn có thể sử dụng các lệnh sau:

*   `npm run dev`: Chạy server phát triển với tính năng Hot Module Replacement (HMR).
*   `npm run build`: Kiểm tra type và build project ra thư mục `dist`.
*   `npm run lint`: Kiểm tra lỗi code bằng ESLint.
*   `npm run preview`: Xem trước bản build production trên máy local.

## 🔗 Kết nối Backend

Frontend này được cấu hình để giao tiếp với backend API. Hãy đảm bảo Server Backend đang chạy (mặc định thường là `http://localhost:3000`).

---
Code with ❤️ by MobiTechPro Team
