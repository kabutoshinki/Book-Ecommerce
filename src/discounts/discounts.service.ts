import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/requests/create-discount.dto';
import { UpdateDiscountDto } from './dto/requests/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { In, Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';
import { validateDiscountDates } from 'src/utils/validate';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}
  async create(createDiscountDto: CreateDiscountDto) {
    const { name, amount, description, startAt, expiresAt, bookIds } =
      createDiscountDto;
    try {
      const discount = this.discountRepository.create({
        name,
        amount,
        description,
        startAt,
        expiresAt,
      });

      await this.discountRepository.save(discount);
      if (bookIds.length === 0) {
        return 'Discount created';
      }
      const books = await this.bookRepository.find({
        where: { id: In(bookIds) },
      });
      books.forEach((book) => {
        book.discount = discount;
      });

      await this.bookRepository.save(books);

      return 'Discount created';
    } catch (error) {
      throw new BadRequestException('Discount name already exist');
    }
  }

  async findAll() {
    return await this.discountRepository.find();
  }

  async findOne(id: string) {
    const discount = await this.discountRepository.findOneBy({ id: id });
    if (!discount) {
      throw new NotFoundException('Discount not exist');
    }
    return discount;
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    try {
      const { name, amount, description, startAt, expiresAt, bookIds } =
        updateDiscountDto;
      validateDiscountDates(startAt, expiresAt);
      const discount = await this.discountRepository.findOneBy({ id: id });
      if (!discount) {
        throw new NotFoundException('Discount not exist');
      }
      discount.name = name;
      discount.amount = amount;
      discount.description = description;
      discount.startAt = startAt;
      discount.expiresAt = expiresAt;

      await this.discountRepository.save(discount);
      if (bookIds == undefined || bookIds.length === 0) {
        return 'Discount created';
      }
      const books = await this.bookRepository.find({
        where: { id: In(bookIds) },
      });
      books.forEach((book) => {
        book.discount = discount;
      });

      await this.bookRepository.save(books);
      return `Discount updated`;
    } catch (error) {
      throw new BadRequestException('Discount name already exist');
    }
  }

  async remove(id: string) {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!discount) {
      throw new NotFoundException('Discount not found');
    }

    const books = await this.bookRepository.find({
      where: { discount: { id } },
    });
    books.forEach((book) => {
      book.discount = null;
    });

    await this.bookRepository.save(books);

    await this.discountRepository.remove(discount);
    return 'Discount deleted';
  }
}
