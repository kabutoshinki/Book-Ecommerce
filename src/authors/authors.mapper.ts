import { Injectable } from '@nestjs/common';
import { AuthorResponseDto } from './dto/responses/author-response.dto';
import { Author } from './entities/author.entity';
import { AuthorResponseForAdminDto } from './dto/responses/author-resoponse-for-admin.dto';
import { CreateAuthorDto } from './dto/requests/create-author.dto';
import { UpdateAuthorDto } from './dto/requests/update-author.dto';
import { formatDate } from '../utils/convert';

@Injectable()
export class AuthorMapper {
  static toAuthorResponseDto(author: Author): AuthorResponseDto {
    const authorResponseDto = new AuthorResponseDto();
    authorResponseDto.id = author.id;
    authorResponseDto.name = author.name;
    authorResponseDto.image = author.image;
    authorResponseDto.description = author.description;
    return authorResponseDto;
  }

  static toAuthorResponseForAdminDto(
    author: Author,
  ): AuthorResponseForAdminDto {
    const authorResponseDto = new AuthorResponseForAdminDto();
    authorResponseDto.id = author.id;
    authorResponseDto.name = author.name;
    authorResponseDto.image = author.image;
    authorResponseDto.description = author.description;
    authorResponseDto.isActive = author.isActive;
    authorResponseDto.created_at = formatDate(author.created_at);
    authorResponseDto.updated_at = formatDate(author.updated_at);
    return authorResponseDto;
  }
  // for admin
  static toAuthorResponseForAdminDtoList(
    authors: Author[],
  ): AuthorResponseForAdminDto[] {
    return authors.map((author) => this.toAuthorResponseForAdminDto(author));
  }
  // for client
  static toAuthorResponseDtoList(authors: Author[]): AuthorResponseDto[] {
    return authors.map((author) => this.toAuthorResponseDto(author));
  }

  static toAuthorEntity(createAuthorDto: CreateAuthorDto): Author {
    const author = new Author();
    author.name = createAuthorDto.name;
    author.description = createAuthorDto.description;

    author.image = createAuthorDto.image
      ? createAuthorDto.image
      : 'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png';

    return author;
  }
  static toUpdateUserEntity(
    existingAuthor: Author,
    updateAuthorDto: UpdateAuthorDto,
  ): Author {
    existingAuthor.name = updateAuthorDto.name ?? existingAuthor.name;
    existingAuthor.description =
      updateAuthorDto.description ?? existingAuthor.description;
    existingAuthor.image = updateAuthorDto.image
      ? updateAuthorDto.image
      : existingAuthor.image;
    existingAuthor.isActive = true;
    return existingAuthor;
  }
}
