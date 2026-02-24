import { Request, Response } from "express";
import { UsersService } from "./users.service";

const usersService = new UsersService();

export class UsersController {
  async getProfile(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const user = await usersService.getProfile(userId);
      return res.json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const updatedUser = await usersService.updateProfile(userId, req.body);
      return res.json(updatedUser);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user.userId;
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await usersService.changePassword(userId, oldPassword, newPassword);
      return res.json({ message: "Password updated successfully" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await usersService.findAll();
      return res.json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await usersService.delete(Number(id));
      return res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
