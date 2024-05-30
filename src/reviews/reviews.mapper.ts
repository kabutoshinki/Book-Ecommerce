import { Book } from 'src/books/entities/book.entity';
import { CreateReviewDto } from './dto/requests/create-review.dto';
import { UpdateReviewDto } from './dto/requests/update-review.dto';
import { ReviewResponseDto } from './dto/responses/review-response.dto';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { UserMapper } from 'src/users/users.mapper';
import { ReviewListResponseDto } from './dto/responses/get-list-review-response.dto';

export class ReviewMapper {
  static toReviewResponseDto(review: Review): ReviewResponseDto {
    const reviewResponseDto = new ReviewResponseDto();
    reviewResponseDto.id = review.id;
    reviewResponseDto.content = review.content;
    reviewResponseDto.rating = review.rating;
    reviewResponseDto.bookId = review.book.id;
    reviewResponseDto.userId = review.reviewer.id;
    return reviewResponseDto;
  }
  static toReviewListResponseDto(review: Review): ReviewListResponseDto {
    const reviewResponseDto = new ReviewListResponseDto();
    reviewResponseDto.id = review.id;
    reviewResponseDto.content = review.content;
    reviewResponseDto.rating = review.rating;
    reviewResponseDto.user = UserMapper.toUserResponseDto(review.reviewer);
    return reviewResponseDto;
  }
  static toReviewListResponseDtoList(
    reviews: Review[],
  ): ReviewListResponseDto[] {
    return reviews.map((review) => this.toReviewListResponseDto(review));
  }
  static toReviewEntity(
    createReviewDto: CreateReviewDto,
    book,
    reviewer,
  ): Review {
    const review = new Review();
    review.content = createReviewDto.content;
    review.rating = createReviewDto.rating;
    review.book = book;
    review.reviewer = reviewer;
    return review;
  }

  static toUpdatedReviewEntity(
    updateReviewDto: UpdateReviewDto,
    existingReview: Review,
    book: Book,
    reviewer: User,
  ): Review {
    existingReview.content = updateReviewDto.content ?? existingReview.content;
    existingReview.rating = updateReviewDto.rating ?? existingReview.rating;
    existingReview.book = book ?? existingReview.book;
    existingReview.reviewer = reviewer ?? existingReview.reviewer;
    return existingReview;
  }
}
