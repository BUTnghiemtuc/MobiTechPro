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
exports.OrdersService = void 0;
const data_source_1 = require("../../config/data-source");
const orders_entity_1 = require("./orders.entity");
const order_items_entity_1 = require("./order-items.entity");
const cart_entity_1 = require("../cart/cart.entity");
const products_entity_1 = require("../products/products.entity");
class OrdersService {
    static createOrder(userId, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                // 1. Get Cart Items
                const cartItems = yield queryRunner.manager.find(cart_entity_1.Cart, {
                    where: { user: { id: userId } },
                    relations: ["product"],
                });
                if (cartItems.length === 0) {
                    throw new Error("Cart is empty");
                }
                // 2. Calculate Total Price and Check Inventory
                let totalPrice = 0;
                const orderItemsData = [];
                for (const item of cartItems) {
                    if (item.product.quantity < item.quantity) {
                        throw new Error(`Product ${item.product.title} is out of stock`);
                    }
                    totalPrice += Number(item.product.price) * item.quantity;
                    // 3. Update Product Inventory
                    item.product.quantity -= item.quantity;
                    item.product.sell_quantity += item.quantity;
                    yield queryRunner.manager.save(item.product);
                    orderItemsData.push({
                        product: item.product,
                        quantity: item.quantity,
                        price_at_purchase: item.product.price,
                    });
                }
                // 4. Create Order
                const newOrder = queryRunner.manager.create(orders_entity_1.Order, {
                    user: { id: userId },
                    address,
                    total_price: totalPrice,
                    status: orders_entity_1.OrderStatus.PENDING,
                });
                const savedOrder = yield queryRunner.manager.save(newOrder);
                // 5. Create OrderItems
                for (const itemData of orderItemsData) {
                    const orderItem = queryRunner.manager.create(order_items_entity_1.OrderItems, Object.assign(Object.assign({}, itemData), { order: savedOrder }));
                    yield queryRunner.manager.save(orderItem);
                }
                // 6. Clear Cart
                yield queryRunner.manager.delete(cart_entity_1.Cart, { user: { id: userId } });
                yield queryRunner.commitTransaction();
                return savedOrder;
            }
            catch (err) {
                yield queryRunner.rollbackTransaction();
                throw err;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    static getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const orderRepository = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
            return yield orderRepository.find({
                relations: ["user", "orderItems", "orderItems.product"],
                order: { created_at: "DESC" },
            });
        });
    }
    static getMyOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderRepository = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
            return yield orderRepository.find({
                where: { user: { id: userId } },
                relations: ["orderItems", "orderItems.product"],
                order: { created_at: "DESC" },
            });
        });
    }
    static updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderRepository = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
            const order = yield orderRepository.findOneBy({ id });
            if (!order)
                throw new Error("Order not found");
            order.status = status;
            return yield orderRepository.save(order);
        });
    }
    static deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderRepository = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
            const order = yield orderRepository.findOneBy({ id });
            if (!order)
                throw new Error("Order not found");
            return yield orderRepository.remove(order);
        });
    }
    static getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const orderRepository = data_source_1.AppDataSource.getRepository(orders_entity_1.Order);
            const productRepository = data_source_1.AppDataSource.getRepository(products_entity_1.Product);
            // 1. Total Revenue (Only from Completed orders)
            const totalRevenueResult = yield orderRepository
                .createQueryBuilder("order")
                .select("SUM(order.total_price)", "total")
                .where("order.status = :status", { status: orders_entity_1.OrderStatus.COMPLETED })
                .getRawOne();
            // 2. Total Orders
            const totalOrders = yield orderRepository.count();
            // 3. Total Products
            const totalProducts = yield productRepository.count();
            // 4. Order Status Distribution
            const statusDistribution = yield orderRepository
                .createQueryBuilder("order")
                .select("order.status", "name")
                .addSelect("COUNT(order.id)", "count")
                .groupBy("order.status")
                .getRawMany();
            // 5. Revenue Trend (Last 7 Days)
            // Note: Use a raw query to ensure we get dates even if no orders
            // For simplicity in TypeORM, we'll fetch last 7 days orders and aggregate in JS
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentOrders = yield orderRepository
                .createQueryBuilder("order")
                .where("order.created_at >= :date", { date: sevenDaysAgo })
                .getMany();
            const revenueTrend = this.calculateRevenueTrend(recentOrders);
            return {
                revenue: parseFloat(totalRevenueResult.total || "0"),
                totalOrders,
                totalProducts,
                statusDistribution: this.formatStatusDistribution(statusDistribution),
                revenueTrend
            };
        });
    }
    static calculateRevenueTrend(orders) {
        // Initialize last 7 days with 0
        const trendMap = new Map();
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
            trendMap.set(dateStr, 0);
        }
        orders.forEach(order => {
            if (order.status !== orders_entity_1.OrderStatus.CANCELLED) {
                const dateStr = new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short' });
                const current = trendMap.get(dateStr) || 0;
                trendMap.set(dateStr, current + Number(order.total_price));
            }
        });
        return Array.from(trendMap, ([name, revenue]) => ({ name, revenue }));
    }
    static formatStatusDistribution(data) {
        // Return formatting for frontend Recharts
        const colors = {
            'Pending': '#f59e0b',
            'Processing': '#3b82f6',
            'Shipped': '#6366f1',
            'Completed': '#10b981',
            'Cancelled': '#ef4444'
        };
        return data.map(item => ({
            name: item.name,
            count: Number(item.count),
            color: colors[item.name] || '#94a3b8'
        }));
    }
}
exports.OrdersService = OrdersService;
//# sourceMappingURL=orders.service.js.map