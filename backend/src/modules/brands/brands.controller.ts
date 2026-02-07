import { Request, Response } from "express";
import { BrandsService } from "./brands.service";
import { AuthRequest } from "../auth/auth.middleware";

export class BrandsController {
  static async getBrands(req: Request, res: Response) {
    try {
      const brands = await BrandsService.findAll();
      res.json(brands);
    } catch (error: any) {
      console.error('Get brands error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getActiveBrands(req: Request, res: Response) {
    try {
      const brands = await BrandsService.findActive();
      res.json(brands);
    } catch (error: any) {
      console.error('Get active brands error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getBrandById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const brand = await BrandsService.findOne(id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error: any) {
      console.error('Get brand by ID error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async createBrand(req: AuthRequest, res: Response) {
    try {
      console.log('Create brand request:', { body: req.body, files: req.files });
      
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const brandData: any = {
        name: req.body.name,
        color: req.body.color || null,
        bgGradient: req.body.bgGradient || null,
        link: req.body.link || null,
        displayOrder: parseInt(req.body.displayOrder) || 0,
        isActive: req.body.isActive === 'true' || req.body.isActive === true,
      };
      
      // Handle file uploads
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.logo?.[0]) {
          brandData.logoUrl = files.logo[0].path; // Cloudinary URL
        }
        if (files.image?.[0]) {
          brandData.imageUrl = files.image[0].path; // Cloudinary URL
        }
      }

      console.log('Creating brand with data:', brandData);
      const brand = await BrandsService.create(brandData);
      res.status(201).json(brand);
    } catch (error: any) {
      console.error('Create brand error:', error);
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  }

  static async updateBrand(req: AuthRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      
      const brandData: any = {
        name: req.body.name,
        color: req.body.color || null,
        bgGradient: req.body.bgGradient || null,
        link: req.body.link || null,
        displayOrder: parseInt(req.body.displayOrder) || 0,
        isActive: req.body.isActive === 'true' || req.body.isActive === true,
      };

      // Handle file uploads
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.logo?.[0]) {
          brandData.logoUrl = files.logo[0].path;
        }
        if (files.image?.[0]) {
          brandData.imageUrl = files.image[0].path;
        }
      }

      const brand = await BrandsService.update(id, brandData);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.json(brand);
    } catch (error: any) {
      console.error('Update brand error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteBrand(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await BrandsService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      console.error('Delete brand error:', error);
      res.status(500).json({ message: error.message });
    }
  }
}
