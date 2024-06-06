import { IsAdminGuard } from '../guard/is-admin.guard';
import { IGetBooksOptions } from './../interfaces/BookPaginationOptions.interface';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  ValidationPipe,
  UsePipes,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/requests/create-book.dto';
import { UpdateBookDto } from './dto/requests/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookClientResponseDto } from './dto/responses/book-client-response.dto';
import { BooksQueryDto } from './dto/requests/books-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetBooksOptionsDto } from './dto/requests/book-options.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(IsAdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.create(createBookDto, file);
  }

  @Get('reviews')
  async booksReviews(@Query() query) {
    const options: IGetBooksOptions = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 6,
      includeReviews: true,
    };
    return await this.booksService.paginateBooks(options);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBooks(
    @Query() query: BooksQueryDto,
  ): Promise<Pagination<BookClientResponseDto>> {
    const options = {
      page: query.page || 1,
      limit: query.limit || 10,
      sort: query.sort,
      search: query.search,
      isActive: true,
      categories: query.categories || [],
      authors: query.authors || [],
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      minRate: query.minRate,
      maxRate: query.maxRate,
    };

    return this.booksService.paginateBooks(options);
  }

  @Get('search')
  async searchBooks(
    @Query('limit') limit = 10,
    @Query('name') name,
  ): Promise<BookClientResponseDto[]> {
    return this.booksService.searchBooksByName(limit, name);
  }

  @Get('options')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBooksOptions(
    @Query() query: GetBooksOptionsDto,
  ): Promise<BookClientResponseDto[]> {
    return this.booksService.getBooksOptions(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.findByBookId(id);
  }
  @Get(':id/related')
  relatedBooks(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit = 3,
  ) {
    return this.booksService.getRelatedBooks(id, limit);
  }

  @UseGuards(IsAdminGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(id, updateBookDto, file);
  }

  @UseGuards(IsAdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.remove(id);
  }
}
