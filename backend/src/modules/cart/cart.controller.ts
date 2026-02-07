import { Response } from "express";
import { CartService } from "./cart.service";
import { AuthRequest } from "../auth/auth.middleware";

export class CartController {
  static async addToCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { productId, quantity } = req.body;
      const item = await CartService.addToCart(userId, productId, quantity);
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const items = await CartService.getCart(userId);
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async removeFromCart(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;
      await CartService.deleteCartItem(Number(id), userId);
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
