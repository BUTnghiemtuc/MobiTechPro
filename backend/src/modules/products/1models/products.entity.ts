import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from "typeorm";
import { User } from "../../users/1models/users.entity";
import { Tag } from "./tags.entity";
import { Brand } from "../../brands/1models/brands.entity"; 

@Entity({ name: 'products' })
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

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column("int", { default: 0 })
  quantity: number;

  @Column("int", { default: 0 })
  sell_quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  // Bảng trung gian Product - Tag
  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({ 
    name: 'product_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' }
  })
  tags: Tag[];
}