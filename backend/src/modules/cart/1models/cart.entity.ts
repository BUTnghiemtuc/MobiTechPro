import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/1models/users.entity";
import { Product } from "../../products/1models/products.entity";

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  quantity: number;

  @CreateDateColumn()
  added_at: Date;

  // Ràng buộc CASCADE: User bị xóa -> Giỏ hàng của User đó bốc hơi theo
  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Ràng buộc CASCADE: Sản phẩm bị xóa -> Sản phẩm bay khỏi mọi giỏ hàng
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}