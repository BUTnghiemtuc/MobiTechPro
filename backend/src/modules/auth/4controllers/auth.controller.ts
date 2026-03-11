import { Request, Response } from "express";
import { AuthService } from "../2services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await AuthService.register(req.body);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
}