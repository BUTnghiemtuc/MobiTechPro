import { AppDataSource } from "../../config/data-source";
import { Cart } from "./cart.entity";
import { Product } from "../products/products.entity";
import { User } from "../users/users.entity";

const cartRepository = AppDataSource.getRepository(Cart);

export class CartService {
  static async addToCart(userId: number, productId: number, quantity: number) {
    const existingItem = await cartRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: ["product"],
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      return await cartRepository.save(existingItem);
    } else {
      const newItem = cartRepository.create({
        user: { id: userId } as User,
        product: { id: productId } as Product,
        quantity,
      });
      return await cartRepository.save(newItem);
    }
  }

  static async getCart(userId: number) {
    return await cartRepository.find({
      where: { user: { id: userId } },
      relations: ["product"],
    });
  }

  static async deleteCartItem(cartId: number, userId: number) {
      return await cartRepository.delete({ id: cartId, user: { id: userId } });
  }
}
