import { formatDate } from '../utils/convert';
import { Injectable } from '@nestjs/common';
import { OrderDetail } from './entities/order_detail.entity';
import { OrderResponseDto } from './dto/responses/order-response.dto';
import { UserMapper } from '../users/users.mapper';
import { OrderResponseForAdminDto } from './dto/responses/order-resoponse-for-admin.dto';
import { OrderDetailResponseDto } from './dto/responses/order-detail-response.dto';
import { OrderItemMapper } from '../order_item/order_item.mapper';
import { OrderDetailGetItemsResponseDto } from './dto/responses/order-detail-get-items-response.dto';
import { OrderGetItemsResponseDto } from './dto/responses/order-get-items-response.dto';

@Injectable()
export class OrderMapper {
  static toOrderResponseDto(order: OrderDetail): OrderResponseDto {
    const orderResponseDto = new OrderResponseDto();
    orderResponseDto.id = order.id;
    orderResponseDto.total = order.total;
    orderResponseDto.quantity = order.items.length;
    orderResponseDto.user = UserMapper.toUserResponseDto(order.user);
    orderResponseDto.status = order.status;
    orderResponseDto.created_at = formatDate(order.created_at);
    orderResponseDto.updated_at = formatDate(order.created_at);
    return orderResponseDto;
  }

  static toOrderDetailResponseDto(order: OrderDetail): OrderDetailResponseDto {
    const orderResponseDto = new OrderDetailResponseDto();
    orderResponseDto.id = order.id;
    orderResponseDto.total = order.total;
    orderResponseDto.quantity = order.items.length;
    orderResponseDto.user = UserMapper.toUserResponseDto(order.user);
    orderResponseDto.status = order.status;
    orderResponseDto.item = OrderItemMapper.toOrderResponseDtoList(order.items);
    orderResponseDto.created_at = formatDate(order.created_at);
    orderResponseDto.updated_at = formatDate(order.updated_at);
    return orderResponseDto;
  }

  static toOrderDetailGetItemsResponseDto(
    order: OrderDetail,
  ): OrderDetailGetItemsResponseDto {
    const orderResponseDto = new OrderDetailGetItemsResponseDto();
    orderResponseDto.id = order.id;
    orderResponseDto.status = order.status;
    orderResponseDto.item = OrderItemMapper.toOrderItemBooksResponseDtoList(
      order.items,
    );
    return orderResponseDto;
  }
  static toOrderIdGetItemsResponseDto(
    order: OrderDetail,
  ): OrderGetItemsResponseDto {
    const orderResponseDto = new OrderGetItemsResponseDto();
    orderResponseDto.id = order.id;
    orderResponseDto.status = order.status;
    orderResponseDto.item = OrderItemMapper.toOrderResponseDtoList(order.items);
    return orderResponseDto;
  }

  static toOrderResponseForAdminDto(
    order: OrderDetail,
  ): OrderResponseForAdminDto {
    const orderResponseDto = new OrderResponseForAdminDto();
    orderResponseDto.id = order.id;
    orderResponseDto.total = order.total;
    orderResponseDto.quantity = order.items.length;
    orderResponseDto.user = UserMapper.toUserResponseDto(order.user);
    orderResponseDto.status = order.status;
    orderResponseDto.created_at = formatDate(order.created_at);
    orderResponseDto.updated_at = formatDate(order.updated_at);
    return orderResponseDto;
  }

  static toOrderResponseDtoList(orders: OrderDetail[]): OrderResponseDto[] {
    return orders.map((order) => this.toOrderResponseDto(order));
  }

  static toOrderDetailResponseDtoList(
    orders: OrderDetail[],
  ): OrderDetailResponseDto[] {
    return orders.map((order) => this.toOrderDetailResponseDto(order));
  }

  static toOrderResponseForAdminDtoList(
    orders: OrderDetail[],
  ): OrderResponseForAdminDto[] {
    return orders.map((order) => this.toOrderResponseForAdminDto(order));
  }
}
