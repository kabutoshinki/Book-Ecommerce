import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { RedisConfigService } from 'config/redis.config';
import { RedisService } from 'nestjs-redis';
import { CacheKey } from '@nestjs/cache-manager';
import { BooksService } from './books/books.service';
import { CategoriesService } from './categories/categories.service';

@Controller()
@ApiTags('Default')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly bookService: BooksService,
    private readonly categoryService: CategoriesService,
  ) {}

  @Get()
  @Render('pages/index')
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
  user() {
    return { title: 'User Page', name: 'huy' };
  }

  @Get('page/book')
  @Render('pages/book')
  async book() {
    const books = await this.bookService.findAll();
    return { title: 'Book Page', books: books };
  }

  @Get('page/author')
  @Render('pages/author')
  author() {
    return { title: 'Author Page', name: 'huy' };
  }

  @Get('page/category')
  @Render('pages/category')
  async category() {
    const categories = await this.categoryService.findAll();
    return { title: 'Category Page', categories: categories };
  }

  @Get('page/order')
  @Render('pages/order')
  order() {
    return { title: 'Order Page', name: 'huy' };
  }

  @Get('page/discount')
  @Render('pages/discount')
  discount() {
    return { title: 'Discount Page', layout: 'layouts/layout', name: 'huy' };
  }

  @Get('page/publisher')
  @Render('pages/publisher')
  publisher() {
    return { title: 'Publisher Page', name: 'huy' };
  }

  @Get('test/errors')
  testErrors(): string {
    throw new UnauthorizedException({ message: 'unknown error' });
  }
}
