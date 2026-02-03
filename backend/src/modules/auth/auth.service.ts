import { AppDataSource } from "../../config/data-source";
import { User } from "../users/users.entity";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  static async register(data: Partial<User>) {
    const { username, password_hash, email, role } = data;

    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new Error("Username or Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_hash!, salt);

    const matchRole = role;

    const newUser = userRepository.create({
      ...data,
      password_hash: hashedPassword,
      role: matchRole,
    });

    return await userRepository.save(newUser);
  }

  static async login(username: string, password: string) {
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "mobi_tech_secret",
      { expiresIn: "1h" }
    );

    return { user, token };
  }
}
