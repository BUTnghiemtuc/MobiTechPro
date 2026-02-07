import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./products.entity";
import { User } from "../users/users.entity";

@Entity({ name: 'Tags' })
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
