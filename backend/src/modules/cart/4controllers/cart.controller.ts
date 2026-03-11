import { Response } from "express";
import { CartService } from "../2services/cart.service";

export class CartController {
  static async addToCart(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
          return res.status(400).json({ message: "Thiếu ID sản phẩm hoặc số lượng" });
      }

      const item = await CartService.addToCart(userId, productId, quantity);
      return res.status(201).json(item);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getCart(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const items = await CartService.getCart(userId);
      return res.status(200).json(items);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async removeFromCart(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      
      await CartService.deleteCartItem(Number(id), userId);
      return res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}