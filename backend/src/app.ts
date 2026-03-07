import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";

// Import các Routes
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