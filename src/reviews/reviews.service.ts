import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly userService: UsersService,
    private readonly bookService: BooksService,
  ) {}
  async create(createReviewDto: CreateReviewDto) {
    const { userId, bookId, content, rating } = createReviewDto;
    const book = await this.bookService.findOne(bookId);

    const reviewer = await this.userService.findById(userId);
    const review = new Review();
    review.content = content;
    review.rating = rating;
    review.book = book;
    review.reviewer = reviewer;
    await this.reviewRepository.save(review);
    return 'Review created';
  }

  async findAll() {
    return await this.reviewRepository.find();
  }

  async findReviewsByBookId(bookId: string) {
    await this.bookService.findOne(bookId);
    return await this.reviewRepository.find({
      where: { book: { id: bookId } },
    });
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOneBy({ id: id });
    if (!review) throw new NotFoundException('Review not exist');
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    const { userId, bookId, content, rating } = updateReviewDto;
    const book = await this.bookService.findOne(bookId);

    const reviewer = await this.userService.findById(userId);
    review.content = content;
    review.rating = rating;
    review.book = book;
    review.reviewer = reviewer;
    await this.reviewRepository.save(review);
    return `Review updated`;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.reviewRepository.delete(id);
    return 'Review deleted';
  }
}
