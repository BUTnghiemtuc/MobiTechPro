import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Product } from "../../products/1models/products.entity";

@Entity({ name: 'brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string; 

  @Column({ nullable: true })
  bg_gradient: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  link: string; 

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}