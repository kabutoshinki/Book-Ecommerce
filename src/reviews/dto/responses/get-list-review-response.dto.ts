import { IsUUID, IsString, IsInt } from 'class-validator';
import { UserResponseDto } from 'src/users/dto/response/user-response.dto';

export class ReviewListResponseDto {
  id: string;
  content: string;
  rating: number;
  user: UserResponseDto;
}
