import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { Category } from 'src/categories/entities/category.entity';
import { Book } from 'src/books/entities/book.entity';

@Entity()
export class BookCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.bookCategories)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => Category, (category) => category.bookCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  bookId: number;

  @Column()
  categoryId: number;
}
