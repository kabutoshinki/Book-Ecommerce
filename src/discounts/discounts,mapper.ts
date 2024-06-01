import { Injectable } from '@nestjs/common';
import { Discount } from './entities/discount.entity';
import { DiscountResponseDto } from './dto/responses/discount-response.dto';
import { DiscountResponseForAdminDto } from './dto/responses/discount-resoponse-for-admin.dto';
import { CreateDiscountDto } from './dto/requests/create-discount.dto';
import { UpdateDiscountDto } from './dto/requests/update-discount.dto';
import { formatDate, formatDateType } from 'src/utils/convert';

@Injectable()
export class DiscountMapper {
  static toDiscountResponseDto(discount: Discount): DiscountResponseDto {
    const discountResponseDto = new DiscountResponseDto();
    discountResponseDto.id = discount.id;
    discountResponseDto.name = discount.name;
    discountResponseDto.amount = discount.amount;
    discountResponseDto.description = discount.description;

    return discountResponseDto;
  }

  static toDiscountResponseForAdminDto(
    discount: Discount,
  ): DiscountResponseForAdminDto {
    const discountResponseDto = new DiscountResponseForAdminDto();
    discountResponseDto.id = discount.id;
    discountResponseDto.name = discount.name;
    discountResponseDto.amount = discount.amount;
    discountResponseDto.description = discount.description;
    discountResponseDto.isActive = discount.isActive;
    discountResponseDto.startAt = discount.startAt;
    discountResponseDto.expiresAt = discount.expiresAt;
    discountResponseDto.created_at = formatDate(discount.created_at);
    discountResponseDto.updated_at = formatDate(discount.updated_at);
    return discountResponseDto;
  }

  static toDiscountResponseDtoList(
    Discounts: Discount[],
  ): DiscountResponseDto[] {
    return Discounts.map((Discount) => this.toDiscountResponseDto(Discount));
  }
  static toDiscountResponseForAdminDtoList(
    Discounts: Discount[],
  ): DiscountResponseForAdminDto[] {
    return Discounts.map((Discount) =>
      this.toDiscountResponseForAdminDto(Discount),
    );
  }

  static toDiscountEntity(createDiscountDto: CreateDiscountDto): Discount {
    const discount = new Discount();
    discount.name = createDiscountDto.name;
    discount.description = createDiscountDto.description;
    discount.amount = createDiscountDto.amount;
    discount.startAt = new Date(createDiscountDto.startAt);
    discount.expiresAt = new Date(createDiscountDto.expiresAt);
    return discount;
  }
  static toUpdateDiscountEntity(
    existingDiscount: Discount,
    updateDiscountDto: UpdateDiscountDto,
  ): Discount {
    existingDiscount.name = updateDiscountDto.name ?? existingDiscount.name;
    existingDiscount.description =
      updateDiscountDto.description ?? existingDiscount.description;
    existingDiscount.amount =
      updateDiscountDto.amount ?? existingDiscount.amount;
    existingDiscount.startAt =
      updateDiscountDto.startAt ?? existingDiscount.startAt;
    existingDiscount.expiresAt =
      updateDiscountDto.expiresAt ?? existingDiscount.expiresAt;
    existingDiscount.isActive = true;

    return existingDiscount;
  }
}
