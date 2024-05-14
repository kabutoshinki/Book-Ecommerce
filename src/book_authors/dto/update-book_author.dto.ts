import { PartialType } from '@nestjs/swagger';
import { CreateBookAuthorDto } from './create-book_author.dto';

export class UpdateBookAuthorDto extends PartialType(CreateBookAuthorDto) {}
