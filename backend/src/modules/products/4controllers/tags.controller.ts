import { Request, Response } from "express";
import { TagsService } from "./tags.service";
import { AuthRequest } from "../auth/auth.middleware";

export class TagsController {
    static async getAllTags(req: Request, res: Response) {
        try {
            const tags = await TagsService.getAllTags();
            res.json(tags);
        } catch (error) {
            console.error("Get all tags error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async createTag(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { name, color } = req.body;
            // Assuming authMiddleware populates req.user
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const userId = req.user.userId; 
            
            if (!name) {
                 res.status(400).json({ message: "Name is required" });
                 return;
            }

            const tag = await TagsService.createTag(name, color, userId);
            res.status(201).json(tag);
        } catch (error) {
            console.error("Create tag error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async assignTagToProduct(req: Request, res: Response) {
        try {
            const { productId, tagId } = req.body;
            
            if (!productId || !tagId) {
                 res.status(400).json({ message: "Product ID and Tag ID are required" });
                 return;
            }

            await TagsService.assignTagToProduct(productId, tagId);
            res.status(200).json({ message: "Tag assigned to product successfully" });
        } catch (error: any) {
            console.error("Assign tag error:", error);
            res.status(400).json({ message: error.message || "Failed to assign tag" });
        }
    }

    static async removeTagFromProduct(req: Request, res: Response) {
        try {
            const { productId, tagId } = req.body;

             if (!productId || !tagId) {
                 res.status(400).json({ message: "Product ID and Tag ID are required" });
                 return;
            }

            await TagsService.removeTagFromProduct(productId, tagId);
            res.status(200).json({ message: "Tag removed from product successfully" });
        } catch (error: any) {
            console.error("Remove tag error:", error);
            res.status(400).json({ message: error.message || "Failed to remove tag" });
        }
    }

    static async getTagStats(req: Request, res: Response) {
        try {
            const stats = await TagsService.getTagStats();
            res.json(stats);
        } catch (error: any) {
            console.error("Get tag stats error:", error);
            res.status(500).json({ message: "Failed to get tag stats" });
        }
    }
}
