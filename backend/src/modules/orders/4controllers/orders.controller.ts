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

  static async getMyOrders(req: AuthRequest, res: Response) {
    try {
      // @ts-ignore
      const userId = req.user!.userId;
      const orders = await OrdersService.getMyOrders(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllOrders(req: AuthRequest, res: Response) {
    try {
      const orders = await OrdersService.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrdersService.updateStatus(Number(id), status);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteOrder(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await OrdersService.deleteOrder(Number(id));
      res.json({ message: "Order deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getStats(req: AuthRequest, res: Response) {
    try {
      const stats = await OrdersService.getDashboardStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
