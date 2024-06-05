import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
  Request,
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
import { ReviewsService } from './reviews/reviews.service';

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
    private readonly reviewService: ReviewsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  @Render('pages/dashboard')
  async root(@Request() req) {
    const reviews = await this.reviewService.getTotalActiveReviews();
    const users = await this.userService.getTotalActiveUser();
    const books = await this.bookService.getTotalActiveBooks();
    const booksRate = await this.bookService.getPopularBooks(10);
    const revenue = await this.orderService.getRevenueByDay();
    const revenueValues = Object.values(revenue).map(
      (status: { Succeeded?: number }) => {
        return status.Succeeded ?? 0;
      },
    );

    const totalRevenue = revenueValues.reduce((acc, value) => acc + value, 0);
    console.log(totalRevenue);
    return {
      title: 'Dashboard Page',
      layout: 'layouts/layout',
      reviews: reviews,
      users: users,
      books: books,
      booksRate: booksRate,
      revenue: revenue,
      totalRevenue: totalRevenue,
      user: req.user,
    };
  }

  @Get('page/about')
  @Render('pages/about')
  about(@Request() req) {
    return { title: 'About Page', user: req.user };
  }

  @Get('public/page/about')
  @Render('pages/about')
  publicAbout() {
    return { title: 'About Page', layout: false };
  }

  @Get('page/login')
  @Render('pages/login')
  login(@Request() req) {
    const errorMessage = req?.query?.errorMessage || '';
    return {
      title: 'Login Page',
      layout: false,
      errors: req?.session?.flash?.errors,
      errorMessage: errorMessage,
    };
  }

  @Get('page/user')
  @Render('pages/user')
  async user(@Query() query, @Request() req) {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
    };
    const users = await this.userService.findAllForAdmin(options);

    return {
      title: 'User Page',
      users: users.items,
      meta: users.meta,
      user: req.user,
    };
  }

  @Get('page/book')
  @Render('pages/book')
  async book(@Query() query: any, @Request() req): Promise<any> {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
      route: '/books/page/book',
    };

    let paginatedBooks: Pagination<BookResponseForAdminDto>;
    if (query.q) {
      paginatedBooks = await this.bookService.paginateBookAdmin(
        options,
        query.q,
      );
    } else {
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
      user: req.user,
    };
  }

  @Get('page/author')
  @Render('pages/author')
  async author(@Query() query: any, @Request() req) {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
    };
    const authors = await this.authorService.paginateAuthorAdmin(options);
    return {
      title: 'Author Page',
      authors: authors.items,
      meta: authors.meta,
      user: req.user,
    };
  }
  @Get('page/review')
  @Render('pages/review')
  async review(@Query() query: any, @Request() req) {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
    };
    const booksReviews = await this.bookService.getBooksReviews(options);
    return {
      title: 'Review Page',
      books: booksReviews.items,
      meta: booksReviews.meta,
      user: req.user,
    };
  }

  @Get('page/category')
  @Render('pages/category')
  async category(@Query() query: any, @Request() req) {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
    };
    const categories = await this.categoryService.findAllForAdmin(options);
    return {
      title: 'Category Page',
      categories: categories.items,
      meta: categories.meta,
      user: req.user,
    };
  }

  @Get('page/order')
  @Render('pages/order')
  async order(@Query() query: any, @Request() req) {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
    };
    const orders = await this.orderService.paginateOrderAdmin(options);

    return {
      title: 'Order Page',
      orders: orders.items,
      meta: orders.meta,
      user: req.user,
    };
  }
  @Get('page/order/:id')
  @Render('pages/order_detail')
  async order_detail(@Param('id') id: string, @Request() req) {
    const order = await this.orderService.getOrderDetailById(id);

    return { title: 'Order Page', order: order, user: req.user };
  }

  @Get('page/discount')
  @Render('pages/discount')
  async discount(@Query() query: any, @Request() req) {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
    };
    const discounts = await this.discountService.findAllForAdmin(options);
    return {
      title: 'Discount Page',
      discounts: discounts.items,
      meta: discounts.meta,
      user: req.user,
    };
  }

  @Get('page/publisher')
  @Render('pages/publisher')
  async publisher(@Query() query: any, @Request() req) {
    const options: IPaginationOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
    };
    const publishers = await this.publisherService.findAllForAdmin(options);

    return {
      title: 'Publisher Page',
      publishers: publishers.items,
      meta: publishers.meta,
      user: req.user,
    };
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
