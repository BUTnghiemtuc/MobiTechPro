import { AppDataSource } from "../../../config/data-source";
import { Product } from "../1models/products.entity";
import { User } from "../../users/1models/users.entity";
import { Brand } from "../../brands/1models/brands.entity";
import { Tag } from "../1models/tags.entity";

const productRepository = AppDataSource.getRepository(Product);

export class ProductsService {
  static async findAll(page: number = 1, limit: number = 10, title?: string, tagName?: string) {
    const skip = (page - 1) * limit;
    
    // QueryBuilder của AI làm rất tốt, em chỉ bổ sung thêm Brand vào thôi
    const queryBuilder = productRepository.createQueryBuilder("product")
      .leftJoinAndSelect("product.tags", "tag") // Nối với bảng Tags
      .leftJoinAndSelect("product.brand", "brand") // THÊM MỚI: Nối với bảng Brand
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

  // Frontend sẽ gửi brand_id và tag_ids lên, mình phải hứng và nhét vào đúng chỗ
  static async create(data: any, userId: number) {
    const { brand_id, tag_ids, ...productData } = data;

    const product: any = productRepository.create({
      ...productData,
      user: { id: userId } as User, // Người tạo sản phẩm
    });

    // Móc nối Brand
    if (brand_id) {
      product.brand = { id: brand_id } as Brand;
    }

    // Móc nối Tags (ManyToMany)
    if (tag_ids && Array.isArray(tag_ids)) {
      product.tags = tag_ids.map((id: number) => ({ id } as Tag));
    }

    return await productRepository.save(product);
  }

  static async update(id: number, data: any) {
    // SỬA BẪY TYPEORM: Phải tìm ra nó trước
    const product: any = await productRepository.findOne({ where: { id }, relations: ["tags", "brand"] });
    if (!product) throw new Error("Không tìm thấy sản phẩm");

    const { brand_id, tag_ids, ...productData } = data;

    // Cập nhật các trường thông thường (title, price...)
    Object.assign(product, productData);

    // Cập nhật Brand
    if (brand_id !== undefined) {
      product.brand = brand_id ? ({ id: brand_id } as Brand) : null;
    }

    // Cập nhật Tags (ManyToMany)
    if (tag_ids && Array.isArray(tag_ids)) {
      product.tags = tag_ids.map((tagId: number) => ({ id: tagId } as Tag));
    }

    // Dùng save() thì TypeORM mới chịu cập nhật bảng trung gian product_tags
    await productRepository.save(product);
    return this.findOne(id);
  }

  static async findOne(id: number) {
    const product = await productRepository.findOne({ 
      where: { id }, 
      relations: ["tags", "brand"] // Lấy chi tiết phải có đủ Brand và Tags
    });
    if (!product) throw new Error("Không tìm thấy sản phẩm");
    return product;
  }

  static async delete(id: number) {
    // Dùng remove thay vì delete để kích hoạt xóa an toàn các mối quan hệ
    const product = await this.findOne(id);
    return await productRepository.remove(product);
  }
}