import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/requests/create-review.dto';
import { UpdateReviewDto } from './dto/requests/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { ReviewMapper } from './reviews.mapper';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly userService: UsersService,
    private readonly bookService: BooksService,
  ) {}
  async create(createReviewDto: CreateReviewDto) {
    const { userId, bookId } = createReviewDto;
    const book = await this.bookService.findOne(bookId);

    const reviewer = await this.userService.findById(userId);

    const review = ReviewMapper.toReviewEntity(createReviewDto, book, reviewer);
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
    const { userId, bookId } = updateReviewDto;
    const book = await this.bookService.findOne(bookId);

    const reviewer = await this.userService.findUserById(userId);
    const updatedReview = ReviewMapper.toUpdatedReviewEntity(
      updateReviewDto,
      review,
      book,
      reviewer,
    );

    await this.reviewRepository.save(updatedReview);
    return `Review updated`;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.reviewRepository.delete(id);
    return 'Review deleted';
  }
}
