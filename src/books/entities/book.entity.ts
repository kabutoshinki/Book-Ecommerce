import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Discount } from 'src/discounts/entities/discount.entity';
import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Review } from 'src/reviews/entities/review.entity';

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

  @Column('decimal')
  price: number;

  @Column('decimal')
  quantity: number;

  @Column()
  image: string;

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
