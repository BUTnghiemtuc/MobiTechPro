import { AppDataSource } from "../../../config/data-source";
import { Contact } from "../1models/contact.entity";

export class ContactsService {
  private static contactRepository = AppDataSource.getRepository(Contact);

  static async create(data: Partial<Contact>) {
    const contact = this.contactRepository.create(data);
    return await this.contactRepository.save(contact);
  }

  static async getAll() {
    return await this.contactRepository.find({ order: { created_at: 'DESC' } });
  }

  static async updateStatus(id: number, status: string) {
    return await this.contactRepository.update(id, { status });
  }
}
