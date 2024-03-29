import { Product } from '@/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  deposit: number;

  @Column()
  role: string;

  @OneToMany(() => Product, (product) => product.seller)
  products: Product[]; // Add this line
}
