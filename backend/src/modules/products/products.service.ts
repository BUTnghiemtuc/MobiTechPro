import { AppDataSource } from "../../config/data-source";
import { Product } from "./products.entity";
import { Like } from "typeorm";
import { User } from "../users/users.entity";

const productRepository = AppDataSource.getRepository(Product);

export class ProductsService {
  static async findAll(page: number = 1, limit: number = 10, title?: string) {
    const skip = (page - 1) * limit;
    const whereCondition = title ? { title: Like(`%${title}%`) } : {};

    const [products, total] = await productRepository.findAndCount({
      where: whereCondition,
      relations: ["tags"], // Load tags if needed
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async create(data: Partial<Product>, userId: number) {
    const product = productRepository.create({
      ...data,
      user: { id: userId } as User, // Link to creator
    });
    return await productRepository.save(product);
  }

  static async update(id: number, data: Partial<Product>) {
    await productRepository.update(id, data);
    return await productRepository.findOneBy({ id });
  }

  static async findOne(id: number) {
    return await productRepository.findOne({ where: { id }, relations: ["tags"] });
  }

  static async delete(id: number) {
    return await productRepository.delete(id);
  }
}
