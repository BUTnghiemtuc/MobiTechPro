import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import multer from "multer";

export interface AuthRequest extends Request {
  user?: any;
  file?: Express.Multer.File;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => { // Explicitly return void
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mobi_tech_secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => { // Explicitly return void
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: "Forbidden" });
        return;
    }

    next();
  };
};
