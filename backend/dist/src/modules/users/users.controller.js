"use strict";
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
exports.UsersController = void 0;
const users_service_1 = require("./users.service");
const usersService = new users_service_1.UsersService();
class UsersController {
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.userId;
                const user = yield usersService.getProfile(userId);
                return res.json(user);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.userId;
                const updatedUser = yield usersService.updateProfile(userId, req.body);
                return res.json(updatedUser);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.userId;
                const { oldPassword, newPassword } = req.body;
                if (!oldPassword || !newPassword) {
                    return res.status(400).json({ message: "Missing required fields" });
                }
                yield usersService.changePassword(userId, oldPassword, newPassword);
                return res.json({ message: "Password updated successfully" });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield usersService.findAll();
                return res.json(users);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield usersService.delete(Number(id));
                return res.json({ message: "User deleted successfully" });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map