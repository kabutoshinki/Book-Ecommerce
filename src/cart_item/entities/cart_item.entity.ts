import { Book } from 'src/books/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Cart, (cart) => cart.items)
  // cart: Cart;

  // @ManyToOne(() => Book, (book) => book.cartItems)
  // book: Book;

  @Column()
  quantity: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
