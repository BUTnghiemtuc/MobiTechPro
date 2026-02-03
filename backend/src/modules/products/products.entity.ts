import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "../users/users.entity";
import { Tag } from "./tags.entity";

@Entity({ name: 'Products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text", { nullable: true })
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image_url: string;

  @Column("int")
  quantity: number;

  @Column("int", { default: 0 })
  sell_quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({ name: 'Product_Tag' })
  tags: Tag[];
}
