import { DiscountResponseDto } from 'src/discounts/dto/responses/discount-response.dto';
import { PublisherResponseDto } from 'src/publishers/dto/responses/publisher-response.dto';
import { AuthorResponseDto } from 'src/authors/dto/responses/author-response.dto';
import { CategoryResponseDto } from 'src/categories/dto/responses/category-response.dto';

export class BookClientResponseDto {
  id: string;

  title: string;

  description: string;

  summary: string;

  price: number;

  image: string;

  average_rate: number;

  sold_quantity: number;

  discount?: DiscountResponseDto;

  publisher?: PublisherResponseDto;

  categories?: CategoryResponseDto[];

  authors?: AuthorResponseDto[];
}
