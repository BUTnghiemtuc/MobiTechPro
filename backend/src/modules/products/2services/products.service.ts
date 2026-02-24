import { AppDataSource } from "../../config/data-source";
import { Product } from "./products.entity";
import { Like } from "typeorm";
import { User } from "../users/users.entity";

const productRepository = AppDataSource.getRepository(Product);

export class ProductsService {
  static async findAll(page: number = 1, limit: number = 10, title?: string, tagName?: string) {
    const skip = (page - 1) * limit;
    
    // Start building the query builder
    const queryBuilder = productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.tags", "tag") // Load tags relation
      .orderBy("product.created_at", "DESC")       
      .skip(skip)
      .take(limit);

    if (title) {
        queryBuilder.andWhere(
            "(LOWER(product.title) LIKE LOWER(:title) OR LOWER(tag.name) LIKE LOWER(:title))",
            { title: `%${title}%` }
        );
    }

    if (tagName) {
        queryBuilder.andWhere("tag.name = :tagName", { tagName });
    }

    const [products, total] = await queryBuilder.getManyAndCount();

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
