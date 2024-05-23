import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { AddressResponseDto } from 'src/addresses/dto/responses/address-response-dto';

export class UserResponseDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  avatar: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  address: AddressResponseDto[];
}
