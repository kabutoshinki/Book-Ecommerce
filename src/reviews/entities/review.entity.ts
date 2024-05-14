import { Book } from 'src/books/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reviewer: string;

  @Column()
  content: string;

  @Column('int')
  rating: number;

  @ManyToOne(() => Book, (book) => book.reviews)
  book: Book;
}
