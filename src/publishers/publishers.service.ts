import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePublisherDto } from './dto/requests/create-publisher.dto';
import { UpdatePublisherDto } from './dto/requests/update-publisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity';
import { Repository } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { PublisherMapper } from './publishers.mapper';
import { PublisherResponseForAdminDto } from './dto/responses/publisher-resoponse-for-admin.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

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
      return {
        success: true,
        message: 'Publisher created successfully',
      };
    } catch (error) {
      throw new BadRequestException('Publisher name already exist');
    }
  }

  async findAll(): Promise<PublisherResponseForAdminDto[]> {
    const publishers = await this.publisherRepository.find({
      where: { isActive: true },
    });
    return PublisherMapper.toPublisherResponseForAdminDtoList(publishers);
  }
  async findAllForAdmin(
    options: IPaginationOptions,
  ): Promise<Pagination<PublisherResponseForAdminDto>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 5;
    const queryBuilder = this.publisherRepository
      .createQueryBuilder('publisher')
      .orderBy('publisher.created_at', 'DESC');
    const [publishers, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const paginatedPublishers =
      PublisherMapper.toPublisherResponseForAdminDtoList(publishers);
    const paginationMeta = {
      totalItems,
      itemCount: publishers.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };

    return new Pagination<PublisherResponseForAdminDto>(
      paginatedPublishers,
      paginationMeta,
    );
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
      const updatedPublisher = PublisherMapper.toUpdatePublisherEntity(
        publisher,
        updatePublisherDto,
      );

      await this.publisherRepository.save(updatedPublisher);
      return {
        success: true,
        message: 'Publisher updated successfully',
      };
    } catch (error) {
      throw new BadRequestException('publisher name is already exist');
    }
  }

  async remove(id: string) {
    const publisher = await this.findOne(id);
    const books = await this.bookRepository.find({
      where: { publisher: { id } },
    });
    if (books.length > 0) {
      throw new BadRequestException(
        'Publisher is associated with books and cannot be deleted',
      );
    }
    publisher.isActive = false;
    await this.publisherRepository.save(publisher);
    return `Publisher removed`;
  }
}
