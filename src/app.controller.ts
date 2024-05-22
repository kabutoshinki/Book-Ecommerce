import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { RedisConfigService } from 'config/redis.config';
import { RedisService } from 'nestjs-redis';
import { CacheKey } from '@nestjs/cache-manager';
import { BooksService } from './books/books.service';
import { CategoriesService } from './categories/categories.service';
import { UsersService } from './users/users.service';
import { OrderDetailsService } from './order_details/order_details.service';
import { DiscountsService } from './discounts/discounts.service';
import { AuthorsService } from './authors/authors.service';
import { PublishersService } from './publishers/publishers.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
@ApiTags('Default')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly bookService: BooksService,
    private readonly categoryService: CategoriesService,
    private readonly userService: UsersService,
    private readonly orderService: OrderDetailsService,
    private readonly discountService: DiscountsService,
    private readonly authorService: AuthorsService,
    private readonly publisherService: PublishersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @Render('pages/dashboard')
  root() {
    return {
      title: 'Dashboard Page',
      layout: 'layouts/layout',
      name: 'Guest',
    };
  }

  @Get('page/about')
  @Render('pages/about')
  about() {
    return { title: 'About Page', name: 'huy' };
  }

  @Get('page/login')
  @Render('pages/login')
  login() {
    return { title: 'Login Page', layout: false, name: 'huy' };
  }

  @Get('page/user')
  @Render('pages/user')
  async user() {
    const users = await this.userService.findAll();

    return { title: 'User Page', users: users };
  }

  @Get('page/book')
  @Render('pages/book')
  async book() {
    const books = await this.bookService.findAllForAdmin();
    const discounts = await this.discountService.findAll();
    const categories = await this.categoryService.findAll();
    const authors = await this.authorService.findAll();
    const publishers = await this.publisherService.findAll();

    return {
      title: 'Book Page',
      books: books,
      discounts: discounts,
      categories: categories,
      authors: authors,
      publishers: publishers,
    };
  }

  @Get('page/author')
  @Render('pages/author')
  async author() {
    const authors = await this.authorService.findAllAuthorsByAdmin();
    return { title: 'Author Page', authors: authors };
  }

  @Get('page/category')
  @Render('pages/category')
  async category() {
    const categories = await this.categoryService.findAll();
    return { title: 'Category Page', categories: categories };
  }

  @Get('page/order')
  @Render('pages/order')
  async order() {
    const orders = await this.orderService.getAllOrderDetails();
    return { title: 'Order Page', orders: orders };
  }

  @Get('page/discount')
  @Render('pages/discount')
  async discount() {
    const discounts = await this.discountService.findAllForAdmin();
    return { title: 'Discount Page', discounts: discounts };
  }

  @Get('page/publisher')
  @Render('pages/publisher')
  async publisher() {
    const publishers = await this.publisherService.findAllForAdmin();
    return { title: 'Publisher Page', publishers: publishers };
  }

  @Get('test/errors')
  testErrors(): string {
    throw new UnauthorizedException({ message: 'unknown error' });
  }

  @Post('test/upload')
  @UseInterceptors(FileInterceptor('file'))
  async testUpload(@UploadedFile() file: Express.Multer.File, @Body() data) {
    const image = await this.cloudinaryService.uploadFile(file, 'test');
    try {
      throw new Error('error');
    } catch (error) {
      await this.cloudinaryService.deleteFile(image.public_id);
      console.log(error);
    }
  }
}
