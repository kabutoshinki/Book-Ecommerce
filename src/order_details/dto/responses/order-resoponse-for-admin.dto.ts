import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { AddressResponseDto } from 'src/addresses/dto/responses/address-response-dto';
import { PaymentStatus } from 'src/enums/payment-status.enums';
import { UserResponseDto } from 'src/users/dto/response/user-response.dto';

export class OrderResponseForAdminDto {
  id: string;

  status: PaymentStatus;

  total: number;

  quantity: number;

  user: UserResponseDto;

  @IsDate()
  created_at: string;

  @IsDate()
  updated_at: string;
}
