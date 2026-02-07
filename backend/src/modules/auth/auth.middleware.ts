import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import multer from "multer";

export interface AuthRequest extends Request {
  user?: any;
  file?: Express.Multer.File;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => { // Explicitly return void
  const authHeader = req.headers.authorization;
  // console.log("Auth Header:", authHeader);

  if (!authHeader) {
    console.log("No auth header");
    res.status(401).json({ message: "No token provided in header" });
    return;
  }

  // Handle both "Bearer <token>" and just "<token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    console.log("Token is empty");
    res.status(401).json({ message: "Token format invalid" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mobi_tech_secret");
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("verify error:", error.message);
    // Return specific error message to help debugging
    res.status(401).json({ message: `Invalid token: ${error.message}` });
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
