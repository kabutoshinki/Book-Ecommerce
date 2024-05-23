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
import { BookResponseForAdminDto } from './books/dto/responses/book-response-for-admin.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

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
    const users = await this.userService.findAllForAdmin();

    return { title: 'User Page', users: users };
  }

  @Get('page/book')
  @Render('pages/book')
  async book(@Query() query: any): Promise<any> {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
      route: '/books/page/book',
    };

    let paginatedBooks: Pagination<BookResponseForAdminDto>;
    if (query.q) {
      // If there's a search query, paginate with search
      paginatedBooks = await this.bookService.paginateBookAdmin(
        options,
        query.q,
      );
    } else {
      // Otherwise, paginate without search
      paginatedBooks = await this.bookService.paginateBookAdmin(options);
    }
    const discounts = await this.discountService.findAll();
    const categories = await this.categoryService.findAll();
    const authors = await this.authorService.findAll();
    const publishers = await this.publisherService.findAll();

    return {
      title: 'Book Page',
      books: paginatedBooks.items,
      meta: paginatedBooks.meta,
      links: paginatedBooks.links,
      discounts: discounts,
      categories: categories,
      authors: authors,
      publishers: publishers,
      query: query,
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
    const categories = await this.categoryService.findAllForAdmin();
    return { title: 'Category Page', categories: categories };
  }

  @Get('page/order')
  @Render('pages/order')
  async order() {
    const orders = await this.orderService.getAllOrderDetails();
    console.log(orders);

    return { title: 'Order Page', orders: orders };
  }
  @Get('page/order/:id')
  @Render('pages/order_detail')
  async order_detail(@Param('id') id: string) {
    const order = await this.orderService.getOrderDetailById(id);

    return { title: 'Order Page', order: order };
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
