import { Request, Response } from 'express';
import { AddressesService } from '../2services/addresses.service';

// Khởi tạo service để gọi các hàm logic
const addressesService = new AddressesService();

export class AddressesController {
  static async findAll(req: any, res: Response) {
    try {
      // req.user sẽ được truyền vào từ Middleware xác thực (Auth Middleware)
      const userId = req.user.id; 
      const addresses = await addressesService.findAll(userId);
      res.status(200).json(addresses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Lấy 1 địa chỉ cụ thể
  static async findOne(req: any, res: Response) {
    try {
      const id = parseInt(req.params.id); // Lấy id từ URL (/addresses/:id)
      const userId = req.user.id;
      const address = await addressesService.findOne(id, userId);
      res.status(200).json(address);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  // Tạo địa chỉ mới
  static async create(req: any, res: Response) {
    try {
      const user = req.user; 
      const newAddress = await addressesService.create(user, req.body);
      res.status(201).json(newAddress);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Cập nhật địa chỉ
  static async update(req: any, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const updatedAddress = await addressesService.update(id, userId, req.body);
      res.status(200).json(updatedAddress);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Xóa địa chỉ
  static async remove(req: any, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      await addressesService.remove(id, userId);
      res.status(200).json({ message: 'Đã xóa địa chỉ thành công' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Set địa chỉ mặc định
  static async setDefault(req: any, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.id;
      const address = await addressesService.setDefault(id, userId);
      res.status(200).json(address);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}