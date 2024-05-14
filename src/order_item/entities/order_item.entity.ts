import { Book } from 'src/books/entities/book.entity';
import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderDetail, (order) => order.items)
  order: OrderDetail;

  @ManyToOne(() => Book, (book) => book.orderItems)
  book: Book;

  @Column()
  quantity: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
