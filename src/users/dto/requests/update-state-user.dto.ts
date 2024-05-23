import { IsBoolean } from 'class-validator';

export class UpdateUserStateDto {
  @IsBoolean()
  state: boolean;
}
