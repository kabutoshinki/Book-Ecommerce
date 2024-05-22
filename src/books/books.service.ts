import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/requests/create-book.dto';
import { UpdateBookDto } from './dto/requests/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { In, Repository } from 'typeorm';
import { PublishersService } from 'src/publishers/publishers.service';
import { AuthorsService } from 'src/authors/authors.service';
import { DiscountsService } from 'src/discounts/discounts.service';
import { CategoriesService } from 'src/categories/categories.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { BookResponseForAdminDto } from './dto/responses/book-response-for-admin.dto';
import { BookMapper } from './books.mapper';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly discountService: DiscountsService,
    private readonly categoryService: CategoriesService,
    private readonly authorService: AuthorsService,
    private readonly publisherService: PublishersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(createBookDto: CreateBookDto, file: Express.Multer.File) {
    const { discountId, publisherId, categoryIds, authorIds, ...bookData } =
      createBookDto;

    const book = this.bookRepository.create(bookData);
    let uploadResult;
    try {
      if (file) {
        uploadResult = await this.cloudinaryService.uploadFile(file, 'books');
        book.image = uploadResult.secure_url;
      }
      if (discountId) {
        const discount = await this.discountService.findOne(discountId);
        if (!discount) {
          throw new NotFoundException('Discount not found');
        }
        book.discount = discount;
      }

      if (publisherId) {
        const publisher = await this.publisherService.findOne(publisherId);
        if (!publisher) {
          throw new NotFoundException('Publisher not found');
        }
        book.publisher = publisher;
      }

      if (categoryIds && categoryIds.length > 0) {
        const categories = await this.categoryService.findByIds(categoryIds);
        book.categories = categories;
      }

      if (authorIds && authorIds.length > 0) {
        const authors = await this.authorService.findByIds(authorIds);
        book.authors = authors;
      }
      await this.bookRepository.save(book);

      return {
        success: true,
        message: 'Book created',
      };
    } catch (error) {
      if (uploadResult) {
        // Delete the uploaded image if an error occurred after uploading the image
        await this.cloudinaryService.deleteFile(uploadResult.public_id);
      }
      console.log(error);

      throw new InternalServerErrorException(
        'Error creating book, changes reverted',
      );
    }
  }

  async findAll() {
    return await this.bookRepository.find({
      relations: ['publisher', 'discount', 'authors', 'categories'],
    });
  }
  async findAllForAdmin(): Promise<BookResponseForAdminDto[]> {
    const books = await this.bookRepository.find({
      relations: ['publisher', 'discount', 'authors', 'categories'],
    });
    return BookMapper.toBookResponseForAdminDtoList(books);
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOneBy({ id: id });
    if (!book) {
      throw new NotFoundException('Book not exist');
    }
    return book;
  }

  async findByIds(ids: string[]) {
    const books = await this.bookRepository.findBy({ id: In(ids) });
    if (books.length !== ids.length) {
      throw new NotFoundException('Some books not found');
    }
    return books;
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
    file: Express.Multer.File,
  ) {
    const { discountId, publisherId, categoryIds, authorIds, ...bookData } =
      updateBookDto;
    let uploadResult;
    console.log('====================================');
    console.log(id);
    console.log(updateBookDto);
    console.log('====================================');
    try {
      const book = await this.findOne(id);
      if (file) {
        uploadResult = await this.cloudinaryService.uploadFile(file, 'books');
        if (book.image.startsWith('https://res.cloudinary.com')) {
          const urlParts = book.image.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];

          await this.cloudinaryService.deleteFile(`books/${publicId}`);
        }
        book.image = uploadResult.secure_url;
      }
      if (discountId) {
        const discount = await this.discountService.findOne(discountId);
        book.discount = discount;
      }

      if (publisherId) {
        const publisher = await this.publisherService.findOne(publisherId);
        book.publisher = publisher;
      }

      if (categoryIds) {
        const categories = await this.categoryService.findByIds(categoryIds);
        book.categories = categories;
      }

      if (authorIds) {
        const authors = await this.authorService.findByIds(authorIds);
        book.authors = authors;
      }

      Object.assign(book, bookData);
      await this.bookRepository.save(book);
      return {
        success: true,
        message: 'Book Updated',
      };
    } catch (error) {
      console.log(error);
      if (uploadResult) {
        await this.cloudinaryService.deleteFile(uploadResult.public_id);
      }
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const book = await this.findOne(id);
    book.isActive = false;
    await this.bookRepository.save(book);
    return 'Book deleted';
  }
}
