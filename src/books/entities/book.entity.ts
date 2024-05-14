import { BookAuthor } from 'src/book_authors/entities/book_author.entity';
import { BookCategory } from 'src/book_categories/entities/book_category.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Discount } from 'src/discounts/entities/discount.entity';

import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { Review } from 'src/reviews/entities/review.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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

  @OneToMany(() => BookCategory, (bookCategory) => bookCategory.book)
  bookCategories: BookCategory[];

  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.book)
  bookAuthors: BookAuthor[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.book)
  orderItems: OrderItem[];

  @ManyToOne(() => Discount, (discount) => discount.books)
  discount: Discount;

  @OneToMany(() => Review, (review) => review.book)
  reviews: Review[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
