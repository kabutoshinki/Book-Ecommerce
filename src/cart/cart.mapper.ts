import { Injectable } from '@nestjs/common';
import { CartResponseDto } from './dto/responses/CartResponseDto';
import { BookMapper } from '../books/books.mapper';
import { CartResponse } from './interfaces/CartResponse';

@Injectable()
export class CartMapper {
  static toCartResponseDto(cart: CartResponse): CartResponseDto {
    const cartResponseDto = new CartResponseDto();
    cartResponseDto.bookId = cart.bookId;
    cartResponseDto.book = BookMapper.toBooksClientResponseDto(cart.book);
    cartResponseDto.quantity = cart.quantity;

    return cartResponseDto;
  }

  static toCartResponseDtoList(carts: CartResponse[]): CartResponseDto[] {
    return carts.map((cart) => this.toCartResponseDto(cart));
  }
}
