import { Response } from "express";
import { TagsService } from "../2services/tags.service";

export class TagsController {
    static async getAllTags(req: any, res: Response) {
        try {
            const tags = await TagsService.getAllTags();
            return res.status(200).json(tags);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async createTag(req: any, res: Response) {
        try {
            const { name, color } = req.body;
            
            if (!name) {
                 return res.status(400).json({ message: "Tên nhãn không được để trống" });
            }

            const tag = await TagsService.createTag(name, color, req.user.id);
            return res.status(201).json(tag);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async assignTagToProduct(req: any, res: Response) {
        try {
            // Ép kiểu về Number để an toàn tuyệt đối
            const productId = Number(req.body.productId);
            const tagId = Number(req.body.tagId);
            
            if (!productId || !tagId) {
                 return res.status(400).json({ message: "Thiếu ID sản phẩm hoặc ID nhãn" });
            }

            await TagsService.assignTagToProduct(productId, tagId);
            return res.status(200).json({ message: "Gắn nhãn thành công" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async removeTagFromProduct(req: any, res: Response) {
        try {
            const productId = Number(req.body.productId);
            const tagId = Number(req.body.tagId);

             if (!productId || !tagId) {
                 return res.status(400).json({ message: "Thiếu ID sản phẩm hoặc ID nhãn" });
            }

            await TagsService.removeTagFromProduct(productId, tagId);
            return res.status(200).json({ message: "Gỡ nhãn thành công" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async getTagStats(req: any, res: Response) {
        try {
            const stats = await TagsService.getTagStats();
            return res.status(200).json(stats);
        } catch (error: any) {
            return res.status(500).json({ message: "Lỗi khi lấy thống kê nhãn" });
        }
    }
}