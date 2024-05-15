import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePublisherDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
