import { Injectable } from '@nestjs/common';
import { formatDate, formatDateType } from 'src/utils/convert';
import { CartResponseDto } from './dto/responses/CartResponseDto';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { BookMapper } from 'src/books/books.mapper';
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
