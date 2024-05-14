import { Author } from 'src/authors/entities/author.entity';
import { Book } from 'src/books/entities/book.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity()
export class BookAuthor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.bookAuthors)
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => Author, (author) => author.bookAuthors)
  @JoinColumn({ name: 'authorId' })
  author: Author;

  @Column()
  bookId: number;

  @Column()
  authorId: number;
}
