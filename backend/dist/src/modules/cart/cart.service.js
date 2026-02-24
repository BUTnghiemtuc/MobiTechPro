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
exports.CartService = void 0;
const data_source_1 = require("../../config/data-source");
const cart_entity_1 = require("./cart.entity");
const cartRepository = data_source_1.AppDataSource.getRepository(cart_entity_1.Cart);
class CartService {
    static addToCart(userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingItem = yield cartRepository.findOne({
                where: {
                    user: { id: userId },
                    product: { id: productId },
                },
                relations: ["product"],
            });
            if (existingItem) {
                existingItem.quantity += quantity;
                return yield cartRepository.save(existingItem);
            }
            else {
                const newItem = cartRepository.create({
                    user: { id: userId },
                    product: { id: productId },
                    quantity,
                });
                return yield cartRepository.save(newItem);
            }
        });
    }
    static getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cartRepository.find({
                where: { user: { id: userId } },
                relations: ["product"],
            });
        });
    }
    static deleteCartItem(cartId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cartRepository.delete({ id: cartId, user: { id: userId } });
        });
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map