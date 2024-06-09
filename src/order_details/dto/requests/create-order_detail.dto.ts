import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from '../../../order_item/dto/create-order_item.dto';

export class CreateOrderDetailDto {
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsArray()
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];

  @IsOptional()
  checkout_method?: string;

  @IsOptional()
  type_method?: string;
}
