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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const data_source_1 = require("../../config/data-source");
const users_entity_1 = require("./users.entity");
const bcrypt = __importStar(require("bcrypt"));
class UsersService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(users_entity_1.User);
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOne({
                where: { id: userId },
                select: ["id", "username", "email", "first_name", "last_name", "phone", "address", "avatar_url", "role", "created_at"]
            });
        });
    }
    updateProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Only allow updating specific fields
            const { first_name, last_name, phone, address, avatar_url } = data;
            yield this.userRepository.update(userId, { first_name, last_name, phone, address, avatar_url });
            return this.getProfile(userId);
        });
    }
    changePassword(userId, oldPass, newPass) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { id: userId } });
            if (!user)
                throw new Error("User not found");
            const isMatch = yield bcrypt.compare(oldPass, user.password_hash);
            if (!isMatch)
                throw new Error("Incorrect old password");
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(newPass, salt);
            yield this.userRepository.update(userId, { password_hash: hashedPassword });
            return true;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find({
                select: ["id", "username", "email", "first_name", "last_name", "phone", "address", "avatar_url", "role", "created_at"],
                order: { created_at: "DESC" }
            });
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.delete(userId);
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map