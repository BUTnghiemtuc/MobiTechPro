// Sửa toàn bộ đường dẫn chọc ra đúng nhà của nó
import { AppDataSource } from "../../../config/data-source";
import { Tag } from "../1models/tags.entity";
import { Product } from "../1models/products.entity";
import { User } from "../../users/1models/users.entity";

// Gom lên đầu để tái sử dụng, code clean hơn
const tagRepository = AppDataSource.getRepository(Tag);
const productRepository = AppDataSource.getRepository(Product);

export class TagsService {
    static async getAllTags(): Promise<Tag[]> {
        return await tagRepository.find({ order: { name: 'ASC' } });
    }

    static async createTag(name: string, color: string, userId: number): Promise<Tag> {
        // Dùng lệnh create của TypeORM nhìn gọn hơn hẳn việc dùng "new Tag()"
        const tag = tagRepository.create({
            name,
            color,
            user: { id: userId } as User
        });

        return await tagRepository.save(tag);
    }

    static async assignTagToProduct(productId: number, tagId: number): Promise<void> {
        const product = await productRepository.findOne({
            where: { id: productId },
            relations: ["tags"]
        });

        if (!product) throw new Error("Không tìm thấy sản phẩm");

        const tag = await tagRepository.findOneBy({ id: tagId });
        if (!tag) throw new Error("Không tìm thấy nhãn");

        // Kiểm tra xem nhãn này đã được gắn cho sản phẩm chưa
        const exists = product.tags.some(t => t.id === tag.id);
        if (exists) return; // Nếu có rồi thì bỏ qua không làm gì cả

        product.tags.push(tag);
        await productRepository.save(product);
    }

    static async removeTagFromProduct(productId: number, tagId: number): Promise<void> {
        const product = await productRepository.findOne({
            where: { id: productId },
            relations: ["tags"]
        });

        if (!product) throw new Error("Không tìm thấy sản phẩm");

        // Lọc bỏ cái tag cần xóa ra khỏi danh sách
        product.tags = product.tags.filter(t => t.id !== Number(tagId));
        await productRepository.save(product);
    }

    static async getTagStats() {
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