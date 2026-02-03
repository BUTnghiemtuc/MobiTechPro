import "reflect-metadata";
import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/products.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/orders.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(cors({
    origin: "http://localhost:5173", // Hoặc "*" để cho phép tất cả (chỉ dùng khi dev)
    credentials: true
}));

app.get("/", (req, res) => {
  res.send("MobiTechPro Backend API is running...");
});

export default app;
