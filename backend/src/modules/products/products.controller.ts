import { Request, Response } from "express";
import { ProductsService } from "./products.service";
import { AuthRequest } from "../auth/auth.middleware";

export class ProductsController {
  static async getProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const title = req.query.title as string;

      const result = await ProductsService.findAll(page, limit, title);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createProduct(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
      const product = await ProductsService.create(req.body, req.user.userId);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
