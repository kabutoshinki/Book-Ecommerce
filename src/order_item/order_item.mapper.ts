import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { OrderItemResponseDto } from './dto/responses/order-items-response.dto';
import { BookMapper } from 'src/books/books.mapper';

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
}
