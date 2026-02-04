import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";

// Import các Routes
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/products.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/orders.routes";

const app = express();

// =========================================================
// 1️⃣ CẤU HÌNH CORS (BẮT BUỘC PHẢI ĐỂ ĐẦU TIÊN)
// =========================================================
app.use(cors({
    // Cho phép cả 2 cổng 5173 và 5174 truy cập
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true, // Cho phép gửi cookie/token
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// =========================================================
// 2️⃣ CẤU HÌNH PARSER DỮ LIỆU
// =========================================================
app.use(express.json());

// =========================================================
// 3️⃣ CẤU HÌNH THƯ MỤC ẢNH (STATIC FILES)
// =========================================================
// Sử dụng process.cwd() để trỏ thẳng về thư mục gốc dự án/uploads
// Cách này an toàn hơn __dirname, tránh lỗi sai đường dẫn
const uploadDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadDir));

// In log ra Terminal để bạn kiểm tra (Debug)
console.log("📂 Server đang mở thư mục ảnh tại:", uploadDir);

// =========================================================
// 4️⃣ KHAI BÁO CÁC ROUTES API
// =========================================================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Route kiểm tra server
app.get("/", (req, res) => {
  res.send("🚀 MobiTechPro Backend API is running successfully!");
});

export default app;