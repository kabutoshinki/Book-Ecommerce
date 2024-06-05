import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { OrderItemResponseDto } from './dto/responses/order-items-response.dto';
import { BookMapper } from '../books/books.mapper';
import { OrderItemBooksResponseDto } from './dto/responses/order-items-books-response';

export class OrderItemMapper {
  static toOrderItemResponseDto(item: OrderItem): OrderItemResponseDto {
    const itemResponseDto = new OrderItemResponseDto();
    itemResponseDto.id = item.id;
    itemResponseDto.quantity = item.quantity;
    itemResponseDto.book = BookMapper.toBookResponseDto(item.book);
    return itemResponseDto;
  }

  static toOrderResponseDtoList(
    orderItems: OrderItem[],
  ): OrderItemResponseDto[] {
    return orderItems.map((order) => this.toOrderItemResponseDto(order));
  }

  static toOrderItemBooksResponseDto(
    item: OrderItem,
  ): OrderItemBooksResponseDto {
    const itemResponseDto = new OrderItemBooksResponseDto();
    itemResponseDto.id = item.id;
    itemResponseDto.quantity = item.quantity;
    itemResponseDto.book = BookMapper.toBookOrderResponseDto(item.book);
    return itemResponseDto;
  }

  static toOrderItemBooksResponseDtoList(
    orderItems: OrderItem[],
  ): OrderItemBooksResponseDto[] {
    return orderItems.map((order) => this.toOrderItemBooksResponseDto(order));
  }
}
