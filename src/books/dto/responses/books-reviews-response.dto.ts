import { ReviewListResponseDto } from 'src/reviews/dto/responses/get-list-review-response.dto';

export class BookReviewResponseDto {
  id: string;

  title: string;

  description: string;

  average_rate: number;

  isActive: boolean;

  summary: string;

  sold_quantity: number;

  price: number;

  image: string;

  review_quantity: number;

  reviews: ReviewListResponseDto[];
}
