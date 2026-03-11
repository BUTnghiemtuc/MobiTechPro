import { AppDataSource } from "../../../config/data-source";
import { Brand } from "../1models/brands.entity";

const brandRepository = AppDataSource.getRepository(Brand);

export class BrandsService {
  static async findAll() {
    return await brandRepository.find({
      order: { display_order: 'ASC' } 
    });
  }

  static async findActive() {
    return await brandRepository.find({
      where: { is_active: true }, 
      order: { display_order: 'ASC' }
    });
  }

  static async findOne(id: number) {
    const brand = await brandRepository.findOneBy({ id });
    if (!brand) throw new Error("Không tìm thấy thương hiệu này");
    return brand;
  }

  static async create(data: Partial<Brand>) {
    const brand = brandRepository.create(data);
    return await brandRepository.save(brand);
  }

  static async update(id: number, data: Partial<Brand>) {
    await this.findOne(id); 
    await brandRepository.update(id, data);
    return await brandRepository.findOneBy({ id });
  }

  static async delete(id: number) {
    const brand = await this.findOne(id);
    return await brandRepository.remove(brand); 
  }
}