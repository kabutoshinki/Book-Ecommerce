import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity';
import { Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createPublisherDto: CreatePublisherDto) {
    try {
      await this.publisherRepository.save(createPublisherDto);
      return 'Publisher created';
    } catch (error) {
      throw new BadRequestException('Publisher name already exist');
    }
  }

  async findAll() {
    return await this.publisherRepository.find();
  }

  async findOne(id: string) {
    const publisher = await this.publisherRepository.findOneBy({ id: id });
    if (!publisher) {
      throw new NotFoundException('Publisher not exist');
    }

    return publisher;
  }

  async update(id: string, updatePublisherDto: UpdatePublisherDto) {
    try {
      const publisher = await this.publisherRepository.findOneBy({ id: id });
      if (!publisher) {
        throw new NotFoundException('Publisher not exist');
      }
      publisher.name = updatePublisherDto.name;
      publisher.address = updatePublisherDto.address;
      await this.publisherRepository.save(publisher);
      return 'Publisher updated';
    } catch (error) {
      throw new BadRequestException('publisher name is already exist');
    }
  }

  async remove(id: string) {
    const publisher = await this.publisherRepository.findOneBy({ id: id });
    if (!publisher) {
      throw new NotFoundException('Publisher not exist');
    }

    const books = await this.bookRepository.find({
      where: { authors: { id } },
    });
    if (books.length > 0) {
      throw new BadRequestException(
        'Publisher is associated with books and cannot be deleted',
      );
    }

    await this.publisherRepository.remove(publisher);
    return `Author removed`;
  }
}
