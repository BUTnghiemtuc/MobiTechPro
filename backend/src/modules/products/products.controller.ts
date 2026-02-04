import { Request, Response } from "express";
import { ProductsService } from "./products.service";
import { AuthRequest } from "../auth/auth.middleware";

export class ProductsController {
  static async getProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const title = req.query.title ? String(req.query.title) : undefined;

      const result = await ProductsService.findAll(page, limit, title);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const product = await ProductsService.findOne(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createProduct(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      
      const productData = req.body;
      if (req.file) {
        productData.image_url = `/uploads/${req.file.filename}`;
      }

      const product = await ProductsService.create(productData, req.user.userId);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateProduct(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      
      const productData = req.body;
      if (req.file) {
        productData.image_url = `/uploads/${req.file.filename}`;
      }

      const product = await ProductsService.update(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      await ProductsService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
