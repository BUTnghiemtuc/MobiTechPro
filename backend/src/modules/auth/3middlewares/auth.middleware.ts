import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// Khai báo thêm thuộc tính user cho Request để TS không báo lỗi
export interface AuthRequest extends Request {
  user?: any;
}

// Đã đổi tên thành authenticateJWT cho khớp với các file Routes
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Không tìm thấy token xác thực" });
    return;
  }

  // Xử lý linh hoạt việc Frontend có gửi kèm chữ "Bearer " hay không
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    res.status(401).json({ message: "Định dạng token không hợp lệ" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mobi_tech_secret");
    req.user = decoded; // Gắn thông tin (id, username, role) vào req để Controller dùng
    next(); // Mở barie cho đi tiếp
  } catch (error: any) {
    res.status(401).json({ message: `Token không hợp lệ hoặc đã hết hạn: ${error.message}` });
    return;
  }
};

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({ message: "Chưa xác thực danh tính" });
        return;
    }

    // Kiểm tra xem role của user có nằm trong danh sách VIP được phép qua không
    if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: "Bạn không có quyền truy cập tài nguyên này" });
        return;
    }

    next();
  };
};