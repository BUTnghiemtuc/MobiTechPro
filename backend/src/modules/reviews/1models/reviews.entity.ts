import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "../users/users.entity";
import { Product } from "../products/products.entity";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    rating!: number; // 1-5 stars

    @Column({ type: "text" })
    comment!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
    @JoinColumn({ name: "productId" })
    product!: Product;
}
