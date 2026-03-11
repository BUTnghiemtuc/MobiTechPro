import { Response } from "express";
import { ProductsService } from "../2services/products.service";

export class ProductsController {
  static async getProducts(req: any, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const title = req.query.title ? String(req.query.title) : undefined;
      const tag = req.query.tag ? String(req.query.tag) : undefined;

      const result = await ProductsService.findAll(page, limit, title, tag);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getProductById(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await ProductsService.findOne(id);
      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }

  static async createProduct(req: any, res: Response) {
    try {
      const productData = { ...req.body };
      
      if (productData.brandId) productData.brand_id = Number(productData.brandId);
      if (productData.tagIds) {
         // Đảm bảo tagIds luôn là một mảng dù Frontend có gửi lên 1 chuỗi
         productData.tag_ids = Array.isArray(productData.tagIds) 
            ? productData.tagIds.map(Number) 
            : [Number(productData.tagIds)];
      }

      // Xử lý ảnh (Upload Cloudinary/Multer)
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        productData.images = req.files.map((file: any) => file.path);
        productData.image_url = req.files[0].path; // Lấy ảnh đầu tiên làm ảnh đại diện
      } else if (req.file) {
        productData.image_url = req.file.path;
        productData.images = [req.file.path];
      }

      // SỬA LỖI CHÍ MẠNG: Dùng req.user.id
      const product = await ProductsService.create(productData, req.user.id);
      return res.status(201).json(product);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async updateProduct(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      const productData = { ...req.body };
      
      // BƯỚC PHIÊN DỊCH TƯƠNG TỰ
      if (productData.brandId) productData.brand_id = Number(productData.brandId);
      if (productData.tagIds) {
         productData.tag_ids = Array.isArray(productData.tagIds) 
            ? productData.tagIds.map(Number) 
            : [Number(productData.tagIds)];
      }

      // Xử lý ảnh update
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        productData.images = req.files.map((file: any) => file.path);
        productData.image_url = req.files[0].path;
      } else if (req.file) {
        productData.image_url = req.file.path;
        productData.images = [req.file.path];
      }

      const product = await ProductsService.update(id, productData);
      return res.status(200).json(product);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async deleteProduct(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      await ProductsService.delete(id);
      return res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}