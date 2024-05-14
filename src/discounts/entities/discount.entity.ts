import { Book } from 'src/books/entities/book.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column()
  description: string;

  @OneToMany(() => Book, (book) => book.discount)
  books: Book[];
}
