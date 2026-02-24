import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./orders.entity";
import { Product } from "../products/products.entity";

@Entity({ name: 'Order_Items' })
export class OrderItems {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price_at_purchase: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => Product)
  product: Product;
}
