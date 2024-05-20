import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/requests/create-author.dto';
import { UpdateAuthorDto } from './dto/requests/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { In, Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    try {
      await this.authorRepository.save(createAuthorDto);
      return 'Author created';
    } catch (error) {
      throw new BadRequestException('Name author is already exist');
    }
  }

  async findByIds(ids: string[]): Promise<Author[]> {
    const authors = await this.authorRepository.findBy({ id: In(ids) });
    if (authors.length !== ids.length) {
      throw new NotFoundException('Some authors not found');
    }
    return authors;
  }

  async findAll() {
    return await this.authorRepository.find();
  }

  async findOne(id: string) {
    const author = await this.authorRepository.findOneBy({ id: id });
    if (!author) {
      throw new NotFoundException('Author not exist');
    }
    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.authorRepository.findOneBy({ id: id });
    if (!author) {
      throw new NotFoundException('Author not exist');
    }
    author.name = updateAuthorDto.name;
    await this.authorRepository.save(author);
    return `Author updated`;
  }

  async remove(id: string) {
    const author = await this.authorRepository.findOneBy({ id: id });
    if (!author) {
      throw new NotFoundException('Author not exist');
    }

    const books = await this.bookRepository.find({
      where: { authors: { id } },
    });
    if (books.length > 0) {
      throw new BadRequestException(
        'Author is associated with books and cannot be deleted',
      );
    }

    await this.authorRepository.remove(author);
    return `Author removed`;
  }
}
