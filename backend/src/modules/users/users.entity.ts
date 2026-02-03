import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Product } from "../products/products.entity";
import { Cart } from "../cart/cart.entity";
import { Order } from "../orders/orders.entity";

export enum UserRole {
  CUSTOMER = "Customer",
  STAFF = "Staff",
}

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password_hash: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Cart, (cart) => cart.user)
  cartItems: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
