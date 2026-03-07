import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

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
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    
    // nếu có bất kì thực thể nào mới thì tự động được khai báo và dùng
    entities: [__dirname + "/../modules/**/1models/*.entity.{js,ts}"],
    
    subscribers: [],
    migrations: [],
});