import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "../users/users.entity";
import { Product } from "../products/products.entity";

@Entity({ name: 'Cart' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  quantity: number;

  @CreateDateColumn()
  added_at: Date;

  @ManyToOne(() => User, (user) => user.cartItems)
  user: User;

  @ManyToOne(() => Product)
  product: Product;
}
