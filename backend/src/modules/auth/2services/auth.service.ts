import { AppDataSource } from "../../../config/data-source";
import { User } from "../../users/1models/users.entity";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  static async register(data: any) {
    // Sửa password_hash thành password cho Frontend dễ gửi
    const { username, password, email, role } = data;

    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new Error("Username hoặc Email đã tồn tại");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: any = userRepository.create({
      ...data,
      password_hash: hashedPassword,
      // Fix bảo mật: Mặc định đăng ký luôn là user, cấm truyền role bậy bạ
      role: role || "user", 
    });

    const savedUser = await userRepository.save(newUser);

    // Fix bảo mật: Xóa cột password_hash trước khi trả data về
    const { password_hash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  static async login(username: string, password: string) {
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error("Không tìm thấy người dùng");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Thông tin đăng nhập không hợp lệ");
    }

    // Fix lỗi đồng bộ: Sửa userId thành id
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "mobi_tech_secret",
      { expiresIn: "24h" } // Thời gian sống của token là 24 tiếng
    );

    // Fix bảo mật: Xóa cột password_hash trước khi trả data về
    const { password_hash: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  }
}