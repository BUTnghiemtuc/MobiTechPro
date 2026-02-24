import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/1models/users.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column({ nullable: true })
  ward: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  label: string; // "Nhà riêng", "Văn phòng", etc.

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
