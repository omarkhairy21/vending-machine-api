import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '@/user/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productName: string;

  @Column()
  cost: number;

  @Column()
  amountAvailable: number;

  @ManyToOne(() => User, (user) => user.products)
  seller: User;

  @Column()
  sellerId: number;
}
