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
exports.OrdersController = void 0;
const orders_service_1 = require("./orders.service");
class OrdersController {
    static createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { address } = req.body;
                const order = yield orders_service_1.OrdersService.createOrder(userId, address);
                res.status(201).json(order);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static getMyOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const userId = req.user.userId;
                const orders = yield orders_service_1.OrdersService.getMyOrders(userId);
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield orders_service_1.OrdersService.getAllOrders();
                res.json(orders);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const order = yield orders_service_1.OrdersService.updateStatus(Number(id), status);
                res.json(order);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield orders_service_1.OrdersService.deleteOrder(Number(id));
                res.json({ message: "Order deleted successfully" });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    static getStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield orders_service_1.OrdersService.getDashboardStats();
                res.json(stats);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.OrdersController = OrdersController;
//# sourceMappingURL=orders.controller.js.map