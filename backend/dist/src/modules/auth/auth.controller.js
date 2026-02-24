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
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield auth_service_1.AuthService.register(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const result = yield auth_service_1.AuthService.login(username, password);
                res.json(result);
            }
            catch (error) {
                res.status(401).json({ message: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map