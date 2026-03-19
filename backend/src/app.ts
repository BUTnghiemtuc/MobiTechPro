import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";

import authRoutes from "./modules/auth/5routes/auth.routes";
import productRoutes from "./modules/products/5routes/products.routes";
import cartRoutes from "./modules/cart/5routes/cart.routes";
import orderRoutes from "./modules/orders/5routes/orders.routes";
import reviewRoutes from "./modules/reviews/5routes/reviews.routes";
import tagsRoutes from "./modules/products/5routes/tags.routes";
import userRoutes from "./modules/users/5routes/users.routes";
import brandRoutes from "./modules/brands/5routes/brands.routes";
import { blogRoutes, blogAdminRoutes } from "./modules/blog/5routes/blog.routes";
import addressRoutes from "./modules/addresses/5routes/addresses.routes";

dotenv.config();

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: [frontendUrl, "http://localhost:5173"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Đăng ký API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/admin/blog", blogAdminRoutes);
app.use("/api/addresses", addressRoutes);

app.get("/", (req, res) => {
  res.send("🚀 MobiTechPro Backend API is running successfully on Render!");
});

export default app;