import { Response } from "express";
import { OrdersService } from "./orders.service";
import { AuthRequest } from "../auth/auth.middleware";

export class OrdersController {
  static async createOrder(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { address } = req.body;
      const order = await OrdersService.createOrder(userId, address);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
