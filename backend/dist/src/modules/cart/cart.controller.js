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
exports.CartController = void 0;
const cart_service_1 = require("./cart.service");
class CartController {
    static addToCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { productId, quantity } = req.body;
                const item = yield cart_service_1.CartService.addToCart(userId, productId, quantity);
                res.json(item);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const items = yield cart_service_1.CartService.getCart(userId);
                res.json(items);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static removeFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { id } = req.params;
                yield cart_service_1.CartService.deleteCartItem(Number(id), userId);
                res.json({ message: "Item removed from cart" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map