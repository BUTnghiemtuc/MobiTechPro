import { AppDataSource } from "../../config/data-source";
import { Order, OrderStatus } from "./orders.entity";
import { OrderItems } from "./order-items.entity";
import { Cart } from "../cart/cart.entity";
import { Product } from "../products/products.entity";
import { User } from "../users/users.entity";

export class OrdersService {
  static async createOrder(userId: number, address: string) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Get Cart Items
      const cartItems = await queryRunner.manager.find(Cart, {
        where: { user: { id: userId } },
        relations: ["product"],
      });

      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // 2. Calculate Total Price and Check Inventory
      let totalPrice = 0;
      const orderItemsData: Partial<OrderItems>[] = [];

      for (const item of cartItems) {
        if (item.product.quantity < item.quantity) {
          throw new Error(`Product ${item.product.title} is out of stock`);
        }

        totalPrice += Number(item.product.price) * item.quantity;

        // 3. Update Product Inventory
        item.product.quantity -= item.quantity;
        item.product.sell_quantity += item.quantity;
        await queryRunner.manager.save(item.product);

        orderItemsData.push({
          product: item.product,
          quantity: item.quantity,
          price_at_purchase: item.product.price,
        });
      }

      // 4. Create Order
      const newOrder = queryRunner.manager.create(Order, {
        user: { id: userId } as User,
        address,
        total_price: totalPrice,
        status: OrderStatus.PENDING,
      });
      const savedOrder = await queryRunner.manager.save(newOrder);

      // 5. Create OrderItems
      for (const itemData of orderItemsData) {
        const orderItem = queryRunner.manager.create(OrderItems, {
          ...itemData,
          order: savedOrder,
        });
        await queryRunner.manager.save(orderItem);
      }

      // 6. Clear Cart
      await queryRunner.manager.delete(Cart, { user: { id: userId } });

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  static async getAllOrders() {
    const orderRepository = AppDataSource.getRepository(Order);
    return await orderRepository.find({
      relations: ["user", "orderItems", "orderItems.product"],
      order: { created_at: "DESC" },
    });
  }

  static async getMyOrders(userId: number) {
    const orderRepository = AppDataSource.getRepository(Order);
    return await orderRepository.find({
      where: { user: { id: userId } },
      relations: ["orderItems", "orderItems.product"],
      order: { created_at: "DESC" },
    });
  }

  static async updateStatus(id: number, status: OrderStatus) {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOneBy({ id });
    if (!order) throw new Error("Order not found");

    order.status = status;
    return await orderRepository.save(order);
  }

  static async deleteOrder(id: number) {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOneBy({ id });
    if (!order) throw new Error("Order not found");

    return await orderRepository.remove(order);
  }

  static async getDashboardStats() {
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);

    // 1. Total Revenue (Only from Completed orders)
    const totalRevenueResult = await orderRepository
      .createQueryBuilder("order")
      .select("SUM(order.total_price)", "total")
      .where("order.status = :status", { status: OrderStatus.COMPLETED })
      .getRawOne();
    
    // 2. Total Orders
    const totalOrders = await orderRepository.count();

    // 3. Total Products
    const totalProducts = await productRepository.count();

    // 4. Order Status Distribution
    const statusDistribution = await orderRepository
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

    const recentOrders = await orderRepository
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
  }

  private static calculateRevenueTrend(orders: Order[]) {
    // Initialize last 7 days with 0
    const trendMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
        trendMap.set(dateStr, 0);
    }

    orders.forEach(order => {
        if (order.status !== OrderStatus.CANCELLED) {
             const dateStr = new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short' });
             const current = trendMap.get(dateStr) || 0;
             trendMap.set(dateStr, current + Number(order.total_price));
        }
    });

    return Array.from(trendMap, ([name, revenue]) => ({ name, revenue }));
  }

  private static formatStatusDistribution(data: any[]) {
      // Return formatting for frontend Recharts
      const colors: Record<string, string> = {
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
