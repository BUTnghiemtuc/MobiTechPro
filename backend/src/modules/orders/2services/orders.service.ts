import { In } from "typeorm";
import { AppDataSource } from "../../../config/data-source";
import { Order, OrderStatus } from "../1models/orders.entity";
import { OrderItem } from "../1models/order-items.entity";
import { Cart } from "../../cart/1models/cart.entity";
import { Product } from "../../products/1models/products.entity";
import { User } from "../../users/1models/users.entity";

export class OrdersService {
  static async createOrder(userId: number, address: string, cartItemIds?: number[]) {
    const queryRunner = AppDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const findOptions: any = {
        where: { user: { id: userId } },
        relations: ["product"],
      };

      if (cartItemIds && cartItemIds.length > 0) {
        findOptions.where = {
          ...findOptions.where,
          id: In(cartItemIds)
        };
      }

      const cartItems = await queryRunner.manager.find(Cart, findOptions);

      if (cartItems.length === 0) {
        throw new Error("Giỏ hàng đang trống");
      }

      let totalPrice = 0;
      const orderItemsData: any[] = [];

      for (const item of cartItems) {
        if (item.product.quantity < item.quantity) {
          throw new Error(`Sản phẩm ${item.product.title} đã hết hàng hoặc không đủ số lượng`);
        }

        totalPrice += Number(item.product.price) * item.quantity;

        item.product.quantity -= item.quantity;
        item.product.sell_quantity += item.quantity;
        await queryRunner.manager.save(item.product);

        orderItemsData.push({
          product: item.product,
          quantity: item.quantity,
          price_at_purchase: item.product.price,
        });
      }

      const newOrder = queryRunner.manager.create(Order, {
        user: { id: userId } as User,
        address,
        total_price: totalPrice,
        status: OrderStatus.PENDING,
      });
      const savedOrder = await queryRunner.manager.save(newOrder);

      for (const itemData of orderItemsData) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          ...itemData,
          order: savedOrder,
        });
        await queryRunner.manager.save(orderItem);
      }

      if (cartItemIds && cartItemIds.length > 0) {
        await queryRunner.manager.delete(Cart, { id: In(cartItemIds) });
      } else {
        await queryRunner.manager.delete(Cart, { user: { id: userId } });
      }

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
      relations: ["user", "order_items", "order_items.product"],
      order: { created_at: "DESC" },
    });
  }

  static async getMyOrders(userId: number) {
    const orderRepository = AppDataSource.getRepository(Order);
    return await orderRepository.find({
      where: { user: { id: userId } },
      relations: ["order_items", "order_items.product"],
      order: { created_at: "DESC" },
    });
  }

  static async updateStatus(id: number, status: OrderStatus) {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOneBy({ id });
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    order.status = status;
    return await orderRepository.save(order);
  }

  static async deleteOrder(id: number) {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = await orderRepository.findOneBy({ id });
    if (!order) throw new Error("Không tìm thấy đơn hàng");

    return await orderRepository.remove(order);
  }

  static async getDashboardStats() {
    const orderRepository = AppDataSource.getRepository(Order);
    const productRepository = AppDataSource.getRepository(Product);

    const totalRevenueResult = await orderRepository
      .createQueryBuilder("order")
      .select("SUM(order.total_price)", "total")
      .where("order.status = :status", { status: OrderStatus.COMPLETED })
      .getRawOne();
    
    const totalOrders = await orderRepository.count();
    const totalProducts = await productRepository.count();

    const statusDistribution = await orderRepository
      .createQueryBuilder("order")
      .select("order.status", "name")
      .addSelect("COUNT(order.id)", "count")
      .groupBy("order.status")
      .getRawMany();

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
    const trendMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' }); 
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