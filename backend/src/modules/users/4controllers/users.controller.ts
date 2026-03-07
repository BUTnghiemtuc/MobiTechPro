import { Response } from "express";
import { UsersService } from "../2services/users.service";

const usersService = new UsersService();

export class UsersController {
  
  // Đổi req thành kiểu any để khỏi phải dùng bùa @ts-ignore
  static async getProfile(req: any, res: Response) {
    try {
      // Đã sửa thành req.user.id cho khớp với token của Auth
      const userId = req.user.id;
      const user = await usersService.getProfile(userId);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateProfile(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const updatedUser = await usersService.updateProfile(userId, req.body);
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async changePassword(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Vui lòng nhập đủ mật khẩu cũ và mới" });
      }

      await usersService.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // API dành cho Admin lấy danh sách
  static async getAllUsers(req: any, res: Response) {
    try {
      const users = await usersService.findAll();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  // API dành cho Admin xóa user
  static async deleteUser(req: any, res: Response) {
    try {
      const { id } = req.params;
      await usersService.delete(Number(id));
      return res.status(200).json({ message: "Đã xóa người dùng thành công" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}