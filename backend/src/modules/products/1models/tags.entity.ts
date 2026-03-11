import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./products.entity";
import { User } from "../../users/1models/users.entity";

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}