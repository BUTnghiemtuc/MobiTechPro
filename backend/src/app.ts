import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";

// Import các Routes
import authRoutes from "./modules/auth/auth.routes";
import productRoutes from "./modules/products/products.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/orders.routes";
import reviewRoutes from "./modules/reviews/reviews.routes";
import tagsRoutes from "./modules/products/tags.routes";
import userRoutes from "./modules/users/users.routes";
import brandRoutes from "./modules/brands/brands.routes";
import { blogRoutes, blogAdminRoutes } from "./modules/blog/blog.routes";
import addressRoutes from "./modules/addresses/addresses.routes";

const app = express();

app.use(cors({
  origin: "*", // Or your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/tags", tagsRoutes); // Register tags routes
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/admin/blog", blogAdminRoutes);
app.use("/api/addresses", addressRoutes);

// Route kiểm tra server
app.get("/", (req, res) => {
  res.send("🚀 MobiTechPro Backend API is running successfully!");
});

export default app;