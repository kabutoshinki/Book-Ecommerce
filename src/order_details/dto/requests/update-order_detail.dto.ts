import { IsArray, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateOrderItemDto } from 'src/order_item/dto/update-order_item.dto';

export class UpdateOrderDetailDto {
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsArray()
  @IsOptional()
  @Type(() => UpdateOrderItemDto)
  orderItems?: UpdateOrderItemDto[];
}
