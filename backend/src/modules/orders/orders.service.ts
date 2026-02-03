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
}
