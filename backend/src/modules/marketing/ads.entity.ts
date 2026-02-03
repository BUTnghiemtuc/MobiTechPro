import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'Ads' })
export class Ads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  image_url: string;

  @Column()
  link_url: string;

  @Column()
  position: string;

  @Column({ default: true })
  is_active: boolean;
}
