import { Author } from '../../authors/entities/author.entity';
import { Category } from '../../categories/entities/category.entity';
import { Discount } from '../../discounts/entities/discount.entity';
import { OrderItem } from '../../order_item/entities/order_item.entity';
import { Publisher } from '../../publishers/entities/publisher.entity';
import { Review } from '../../reviews/entities/review.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  summary: string;

  @Column({ default: 0, nullable: true })
  price: number;

  @Column({ default: 0, nullable: true })
  sold_quantity: number;

  @Column({
    default:
      'https://www.ribabooks.com/images/thumbs/def/default-image_600.png',
  })
  image: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'float', default: 0 })
  average_rate: number;

  @ManyToMany((type) => Category)
  @JoinTable()
  categories: Category[];

  @ManyToMany((type) => Author)
  @JoinTable()
  authors: Author[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.book)
  orderItems: OrderItem[];

  @ManyToOne(() => Discount, (discount) => discount.books)
  discount: Discount;

  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  publisher: Publisher;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
