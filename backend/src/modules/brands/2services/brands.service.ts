import { AppDataSource } from "../../config/data-source";
import { Brand } from "./brands.entity";

const brandRepository = AppDataSource.getRepository(Brand);

export class BrandsService {
  static async findAll() {
    return await brandRepository.find({
      order: { displayOrder: 'ASC' }
    });
  }

  static async findActive() {
    return await brandRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' }
    });
  }

  static async findOne(id: number) {
    return await brandRepository.findOneBy({ id });
  }

  static async create(data: Partial<Brand>) {
    const brand = brandRepository.create(data);
    return await brandRepository.save(brand);
  }

  static async update(id: number, data: Partial<Brand>) {
    await brandRepository.update(id, data);
    return await brandRepository.findOneBy({ id });
  }

  static async delete(id: number) {
    return await brandRepository.delete(id);
  }
}
