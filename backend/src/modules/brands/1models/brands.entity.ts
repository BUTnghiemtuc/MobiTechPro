import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'Brands' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string; // Hex color code

  @Column({ nullable: true })
  bgGradient: string; // Tailwind gradient classes

  @Column({ nullable: true })
  logoUrl: string; // Path to logo image

  @Column({ nullable: true })
  imageUrl: string; // Path to flagship phone image

  @Column({ nullable: true })
  link: string; // Link to filtered products page

  @Column({ type: 'int', default: 0 })
  displayOrder: number; // Order in carousel

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Show/hide brand

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
