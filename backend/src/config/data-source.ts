import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    // làm local thì tắt các cmt ở đây đi
    // type: "postgres",
    // host: process.env.DB_HOST,
    // port: parseInt(process.env.DB_PORT || "5432"),
    // username: process.env.DB_USERNAME, 
    // password: process.env.DB_PASSWORD,
    
    // // 1. Đổi DB_NAME thành DB_DATABASE cho khớp với file .env
    // database: process.env.DB_DATABASE,
    
    synchronize: true, 
    logging: false,
    
    // làm local thì bật cmt 2 dòng này
    type: "postgres",
    url: process.env.DB_URL,

    // làm local thì tắt cmt d1, bật d2
    // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, 
    ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : false,

    // nếu có bất kì thực thể nào mới thì tự động được khai báo và dùng
    entities: [__dirname + "/../modules/**/1models/*.entity.{js,ts}"],
    
    subscribers: [],
    migrations: [],
}); 