import { AppDataSource } from "../../config/data-source";
import { User } from "./users.entity";
import * as bcrypt from "bcrypt";

export class UsersService {
  private userRepository = AppDataSource.getRepository(User);

  async getProfile(userId: number) {
    return await this.userRepository.findOne({
      where: { id: userId },
      select: ["id", "username", "email", "first_name", "last_name", "phone", "address", "avatar_url", "role", "created_at"]
    });
  }

  async updateProfile(userId: number, data: Partial<User>) {
    // Only allow updating specific fields
    const { first_name, last_name, phone, address, avatar_url } = data;
    await this.userRepository.update(userId, { first_name, last_name, phone, address, avatar_url });
    return this.getProfile(userId);
  }

  async changePassword(userId: number, oldPass: string, newPass: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPass, user.password_hash);
    if (!isMatch) throw new Error("Incorrect old password");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);

    await this.userRepository.update(userId, { password_hash: hashedPassword });
    return true;
  }

  async findAll() {
    return await this.userRepository.find({
      select: ["id", "username", "email", "first_name", "last_name", "phone", "address", "avatar_url", "role", "created_at"],
      order: { created_at: "DESC" }
    });
  }

  async delete(userId: number) {
    return await this.userRepository.delete(userId);
  }
}
