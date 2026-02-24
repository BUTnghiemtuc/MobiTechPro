"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
// Import tất cả Entity vào đây để TypeORM nhận diện chắc chắn 100%
const users_entity_1 = require("../modules/users/users.entity");
const products_entity_1 = require("../modules/products/products.entity");
const tags_entity_1 = require("../modules/products/tags.entity");
const cart_entity_1 = require("../modules/cart/cart.entity");
const orders_entity_1 = require("../modules/orders/orders.entity");
const order_items_entity_1 = require("../modules/orders/order-items.entity");
const ads_entity_1 = require("../modules/marketing/ads.entity");
const reviews_entity_1 = require("../modules/reviews/reviews.entity");
const brands_entity_1 = require("../modules/brands/brands.entity");
const blog_entity_1 = require("../modules/blog/blog.entity");
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [users_entity_1.User, products_entity_1.Product, tags_entity_1.Tag, cart_entity_1.Cart, orders_entity_1.Order, order_items_entity_1.OrderItems, ads_entity_1.Ads, reviews_entity_1.Review, brands_entity_1.Brand, blog_entity_1.BlogPost],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map