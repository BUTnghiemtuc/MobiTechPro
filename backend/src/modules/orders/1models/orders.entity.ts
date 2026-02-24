import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "../users/users.entity";
import { OrderItems } from "./order-items.entity";

export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

@Entity({ name: 'Orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  total_price: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column()
  address: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItems, (orderItem) => orderItem.order)
  orderItems: OrderItems[];
}
