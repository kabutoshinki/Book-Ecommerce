import { Book } from '../../books/entities/book.entity';
import { OrderDetail } from '../../order_details/entities/order_detail.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderDetail, (order) => order.items)
  order: OrderDetail;

  @ManyToOne(() => Book, (book) => book.orderItems)
  book: Book;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
