import { Request, Response } from "express";
import { ProductsService } from "./products.service";
import { AuthRequest } from "../auth/auth.middleware";

export class ProductsController {
  static async getProducts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const title = req.query.title ? String(req.query.title) : undefined;
      const tag = req.query.tag ? String(req.query.tag) : undefined;

      const result = await ProductsService.findAll(page, limit, title, tag);
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
      
      // Handle multiple images
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Cloudinary middleware returns array of files with .path as full URL
        productData.images = req.files.map((file: any) => file.path);
        // Set first image as main image_url for backward compatibility
        productData.image_url = req.files[0].path;
      } else if (req.file) {
        // Single file upload (backward compatibility)
        productData.image_url = req.file.path;
        productData.images = [req.file.path];
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
      
      // Handle multiple images
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        productData.images = req.files.map((file: any) => file.path);
        productData.image_url = req.files[0].path;
      } else if (req.file) {
        // Single file upload (backward compatibility)
        productData.image_url = req.file.path;
        productData.images = [req.file.path];
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
