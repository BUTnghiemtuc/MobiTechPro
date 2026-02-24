"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
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
    }
    catch (error) {
        console.error("verify error:", error.message);
        // Return specific error message to help debugging
        res.status(401).json({ message: `Invalid token: ${error.message}` });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const checkRole = (roles) => {
    return (req, res, next) => {
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
exports.checkRole = checkRole;
//# sourceMappingURL=auth.middleware.js.map