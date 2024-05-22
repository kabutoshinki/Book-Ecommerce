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
import { DiscountMapper } from './discounts,mapper';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}
  async create(createDiscountDto: CreateDiscountDto) {
    const { bookIds } = createDiscountDto;
    try {
      const discount = DiscountMapper.toDiscountEntity(createDiscountDto);
      console.log('Created discount:', discount);

      await this.discountRepository.save(discount);
      if (!bookIds?.length) {
        return {
          success: true,
          message: 'Discount created',
        };
      }
      const books = await this.bookRepository.find({
        where: { id: In(bookIds) },
      });
      books.forEach((book) => {
        book.discount = discount;
      });

      await this.bookRepository.save(books);

      return {
        success: true,
        message: 'Discount created',
      };
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Discount name already exist');
    }
  }

  async findAll() {
    const discounts = await this.discountRepository.find({
      where: { isActive: true },
    });
    return DiscountMapper.toDiscountResponseDtoList(discounts);
  }
  async findAllForAdmin() {
    const discounts = await this.discountRepository.find();

    return DiscountMapper.toDiscountResponseForAdminDtoList(discounts);
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
      // discount.name = name;
      // discount.amount = amount;
      // discount.description = description;
      // discount.startAt = startAt;
      // discount.expiresAt = expiresAt;
      const savedDiscount = DiscountMapper.toUpdateDiscountEntity(
        discount,
        updateDiscountDto,
      );
      await this.discountRepository.save(savedDiscount);
      if (!bookIds?.length) {
        return {
          success: true,
          message: `Discount updated`,
        };
      }
      const books = await this.bookRepository.find({
        where: { id: In(bookIds) },
      });
      books.forEach((book) => {
        book.discount = discount;
      });

      await this.bookRepository.save(books);
      return {
        success: true,
        message: `Discount updated`,
      };
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
    discount.isActive = false;
    await this.discountRepository.save(discount);
    return 'Discount deleted';
  }
}
