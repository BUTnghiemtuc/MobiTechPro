"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
// Import các Routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const products_routes_1 = __importDefault(require("./modules/products/products.routes"));
const cart_routes_1 = __importDefault(require("./modules/cart/cart.routes"));
const orders_routes_1 = __importDefault(require("./modules/orders/orders.routes"));
const reviews_routes_1 = __importDefault(require("./modules/reviews/reviews.routes"));
const tags_routes_1 = __importDefault(require("./modules/products/tags.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const brands_routes_1 = __importDefault(require("./modules/brands/brands.routes"));
const blog_routes_1 = require("./modules/blog/blog.routes");
const addresses_routes_1 = __importDefault(require("./modules/addresses/addresses.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*", // Or your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", products_routes_1.default);
app.use("/api/tags", tags_routes_1.default); // Register tags routes
app.use("/api/cart", cart_routes_1.default);
app.use("/api/orders", orders_routes_1.default);
app.use("/api/reviews", reviews_routes_1.default);
app.use("/api/users", users_routes_1.default);
app.use("/api/brands", brands_routes_1.default);
app.use("/api/blog", blog_routes_1.blogRoutes);
app.use("/api/admin/blog", blog_routes_1.blogAdminRoutes);
app.use("/api/addresses", addresses_routes_1.default);
// Route kiểm tra server
app.get("/", (req, res) => {
    res.send("🚀 MobiTechPro Backend API is running successfully!");
});
exports.default = app;
//# sourceMappingURL=app.js.map