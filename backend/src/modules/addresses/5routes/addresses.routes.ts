import { Router } from 'express';
import { AddressesController } from '../4controllers/addresses.controller';
import { authenticateJWT } from '../../auth/3middlewares/auth.middleware';

const router = Router();

// Lấy tất cả địa chỉ của user hiện tại
router.get('/', authenticateJWT, AddressesController.findAll);

// Lấy 1 địa chỉ cụ thể
router.get('/:id', authenticateJWT, AddressesController.findOne);

// Tạo địa chỉ mới
router.post('/', authenticateJWT, AddressesController.create);

// Cập nhật địa chỉ
router.put('/:id', authenticateJWT, AddressesController.update);

// Xóa địa chỉ
router.delete('/:id', authenticateJWT, AddressesController.remove);

// Đặt địa chỉ làm mặc định
router.post('/:id/default', authenticateJWT, AddressesController.setDefault);

export default router;