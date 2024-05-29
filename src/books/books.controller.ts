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
  Put,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/requests/create-book.dto';
import { UpdateBookDto } from './dto/requests/update-book.dto';
import { CacheKey } from '@nestjs/cache-manager';
import { FileInterceptor } from '@nestjs/platform-express';
import { Book } from './entities/book.entity';
import { BookClientResponseDto } from './dto/responses/book-client-response.dto';
import { BooksQueryDto } from './dto/requests/books-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.create(createBookDto, file);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getBooks(
    @Query() query: BooksQueryDto,
  ): Promise<Pagination<BookClientResponseDto>> {
    return this.booksService.getBooks(query);
  }

  @Get('search')
  async searchBooks(
    @Query('limit') limit = 10,
    @Query('name') name,
  ): Promise<BookClientResponseDto[]> {
    return this.booksService.searchBooksByName(limit, name);
  }
  @Get('on-sale')
  async getOnSaleBooks(
    @Query('limit') limit = 5,
  ): Promise<BookClientResponseDto[]> {
    return this.booksService.getOnSaleBooks(limit);
  }

  @Get('best-sales')
  async getPopularBooks(
    @Query('limit') limit = 5,
  ): Promise<BookClientResponseDto[]> {
    return this.booksService.getBestSellingBooks(limit);
  }

  @Get('popular')
  async getFeaturedBooks(
    @Query('limit') limit = 5,
    @Query('categoryName') categoryName,
  ): Promise<BookClientResponseDto[]> {
    return this.booksService.getPopularBooks(limit, categoryName);
  }

  @Get('best-books')
  async getBestBooks(
    @Query('limit') limit = 3,
  ): Promise<BookClientResponseDto[]> {
    return this.booksService.getBestBooks(limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.findOne(id);
  }

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

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.remove(id);
  }
}
