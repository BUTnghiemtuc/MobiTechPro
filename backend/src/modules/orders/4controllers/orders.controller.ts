import { Response } from "express";
import { OrdersService } from "../2services/orders.service";

export class OrdersController {
  static async createOrder(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { address } = req.body;

      if (!address) {
         return res.status(400).json({ message: "Vui lòng cung cấp địa chỉ giao hàng" });
      }

      const order = await OrdersService.createOrder(userId, address);
      return res.status(201).json(order);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async getMyOrders(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const orders = await OrdersService.getMyOrders(userId);
      return res.status(200).json(orders);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getAllOrders(req: any, res: Response) {
    try {
      const orders = await OrdersService.getAllOrders();
      return res.status(200).json(orders);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateStatus(req: any, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrdersService.updateStatus(Number(id), status);
      return res.status(200).json(order);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async deleteOrder(req: any, res: Response) {
    try {
      const { id } = req.params;
      await OrdersService.deleteOrder(Number(id));
      return res.status(200).json({ message: "Xóa đơn hàng thành công" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async getStats(req: any, res: Response) {
    try {
      const stats = await OrdersService.getDashboardStats();
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}