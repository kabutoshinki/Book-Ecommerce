import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthPayloadDto {
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  @ApiProperty({
    description: 'email',
    example: 'huy@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'password',
    example: '123456',
  })
  password: string;

  @IsOptional()
  guest_cart?: string;
}
