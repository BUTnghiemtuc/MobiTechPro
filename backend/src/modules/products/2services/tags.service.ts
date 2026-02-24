import { AppDataSource } from "../../config/data-source";
import { Tag } from "./tags.entity";
import { Product } from "./products.entity";
import { User } from "../users/users.entity";

export class TagsService {
    static async getAllTags(): Promise<Tag[]> {
        const tagRepository = AppDataSource.getRepository(Tag);
        return await tagRepository.find({ order: { name: 'ASC' } });
    }

    static async createTag(name: string, color: string, userId: number): Promise<Tag> {
        const tagRepository = AppDataSource.getRepository(Tag);
        
        const tag = new Tag();
        tag.name = name;
        tag.color = color;
        
        // Link to user who created it
        const user = new User();
        user.id = userId;
        tag.user = user;

        return await tagRepository.save(tag);
    }

    static async assignTagToProduct(productId: number, tagId: number): Promise<void> {
        const productRepository = AppDataSource.getRepository(Product);
        const tagRepository = AppDataSource.getRepository(Tag);

        const product = await productRepository.findOne({
            where: { id: productId },
            relations: ["tags"]
        });

        if (!product) {
            throw new Error("Product not found");
        }

        const tag = await tagRepository.findOneBy({ id: tagId });
        if (!tag) {
            throw new Error("Tag not found");
        }

        // Check for duplicates
        const exists = product.tags.some(t => t.id === tag.id);
        if (exists) {
            // Already assigned, just return or throw error. 
            // User requirement: "Kiểm tra xem cặp product_id và tag_id đã tồn tại chưa"
            // Returning ensures idempotency without error.
            return; 
        }

        product.tags.push(tag);
        await productRepository.save(product);
    }

    static async removeTagFromProduct(productId: number, tagId: number): Promise<void> {
        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOne({
            where: { id: productId },
            relations: ["tags"]
        });

        if (!product) {
            throw new Error("Product not found");
        }

        // Filter out the tag to be removed
        product.tags = product.tags.filter(t => t.id !== Number(tagId));
        await productRepository.save(product);
    }

    static async getTagStats() {
        // Query to count products per tag
        const tagRepository = AppDataSource.getRepository(Tag);
        
        // Use QueryBuilder for complex aggregation
        return await tagRepository.createQueryBuilder("tag")
            .leftJoin("tag.products", "product")
            .select([
                "tag.id AS id", 
                "tag.name AS name", 
                "tag.color AS color", 
                "COUNT(product.id) AS productCount"
            ])
            .groupBy("tag.id")
            .addGroupBy("tag.name")
            .addGroupBy("tag.color")
            .getRawMany();
    }
}
