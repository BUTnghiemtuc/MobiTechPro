import { Response } from "express";
import { BrandsService } from "../2services/brands.service";

export class BrandsController {
  static async getBrands(req: any, res: Response) {
    try {
      const brands = await BrandsService.findAll();
      return res.status(200).json(brands);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getActiveBrands(req: any, res: Response) {
    try {
      const brands = await BrandsService.findActive();
      return res.status(200).json(brands);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async getBrandById(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      const brand = await BrandsService.findOne(id);
      return res.status(200).json(brand);
    } catch (error: any) {
      return res.status(404).json({ message: error.message }); 
    }
  }

  static async createBrand(req: any, res: Response) {
    try {
      const brandData: any = {
        name: req.body.name,
        color: req.body.color || null,
        bg_gradient: req.body.bgGradient || null, 
        link: req.body.link || null,
        display_order: parseInt(req.body.displayOrder) || 0,
        is_active: req.body.isActive === 'true' || req.body.isActive === true,
      };
      
      if (req.files) {
        if (req.files.logo?.[0]) {
          brandData.logo_url = req.files.logo[0].path; 
        }
        if (req.files.image?.[0]) {
          brandData.image_url = req.files.image[0].path; 
        }
      }

      const brand = await BrandsService.create(brandData);
      return res.status(201).json(brand);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateBrand(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      
      const brandData: any = {
        name: req.body.name,
        color: req.body.color || null,
        bg_gradient: req.body.bgGradient || null,
        link: req.body.link || null,
        display_order: parseInt(req.body.displayOrder) || 0,
        is_active: req.body.isActive === 'true' || req.body.isActive === true,
      };

      if (req.files) {
        if (req.files.logo?.[0]) {
          brandData.logo_url = req.files.logo[0].path;
        }
        if (req.files.image?.[0]) {
          brandData.image_url = req.files.image[0].path;
        }
      }

      const brand = await BrandsService.update(id, brandData);
      return res.status(200).json(brand);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async deleteBrand(req: any, res: Response) {
    try {
      const id = Number(req.params.id);
      await BrandsService.delete(id);
      return res.status(200).json({ message: "Xóa thương hiệu thành công" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}