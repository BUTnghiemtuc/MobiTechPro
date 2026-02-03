import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

// Import tất cả Entity vào đây để TypeORM nhận diện chắc chắn 100%
import { User } from "../modules/users/users.entity";
import { Product } from "../modules/products/products.entity";
import { Tag } from "../modules/products/tags.entity";
import { Cart } from "../modules/cart/cart.entity";
import { Order } from "../modules/orders/orders.entity";
import { OrderItems } from "../modules/orders/order-items.entity";
import { Ads } from "../modules/marketing/ads.entity";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    synchronize: true, 
    logging: false,
    
    entities: [User, Product, Tag, Cart, Order, OrderItems, Ads],
    
    subscribers: [],
    migrations: [],
});