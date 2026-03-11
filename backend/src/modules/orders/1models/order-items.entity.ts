import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./orders.entity";
import { Product } from "../../products/1models/products.entity";

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price_at_purchase: number;

  @ManyToOne(() => Order, (order) => order.order_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}