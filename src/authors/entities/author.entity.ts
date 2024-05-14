import { BookAuthor } from 'src/book_authors/entities/book_author.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.author)
  bookAuthors: BookAuthor[];
}
