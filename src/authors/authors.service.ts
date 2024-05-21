import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/requests/create-author.dto';
import { UpdateAuthorDto } from './dto/requests/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { In, Repository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { AuthorMapper } from './authors.mapper';
import { AuthorResponseDto } from './dto/responses/author-response.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createAuthorDto: CreateAuthorDto, file: Express.Multer.File) {
    const author = this.authorRepository.create(createAuthorDto);
    let uploadResult;
    try {
      if (file) {
        uploadResult = await this.cloudinaryService.uploadFile(file, 'authors');
        author.image = uploadResult.secure_url;
      }

      await this.authorRepository.save(author);
      return {
        success: true,
        message: 'Author created successfully',
      };
    } catch (error) {
      if (uploadResult) {
        await this.cloudinaryService.deleteFile(uploadResult.public_id);
      }
      console.log(error);
      throw new BadRequestException('Name author is already exist');
    }
  }

  async findByIds(ids: string[]): Promise<Author[]> {
    const authors = await this.authorRepository.findBy({ id: In(ids) });
    if (authors.length !== ids.length) {
      throw new NotFoundException('Some authors not found');
    }
    return authors;
  }

  async findAll(): Promise<AuthorResponseDto[]> {
    const authors = await this.authorRepository.find();
    return AuthorMapper.toAuthorResponseDtoList(authors);
  }

  async findAllAuthorsByAdmin(): Promise<AuthorResponseDto[]> {
    const authors = await this.authorRepository.find();
    return AuthorMapper.toAuthorResponseForAdminDtoList(authors);
  }

  async findOne(id: string) {
    const author = await this.authorRepository.findOneBy({ id: id });
    if (!author) {
      throw new NotFoundException('Author not exist');
    }
    return author;
  }

  async update(
    id: string,
    updateAuthorDto: UpdateAuthorDto,
    file: Express.Multer.File,
  ) {
    const author = await this.findOne(id);

    let uploadResult;
    try {
      const savedAuthor = AuthorMapper.toUpdateUserEntity(
        author,
        updateAuthorDto,
      );
      if (file) {
        uploadResult = await this.cloudinaryService.uploadFile(file, 'authors');
        if (savedAuthor.image.startsWith('https://res.cloudinary.com')) {
          const urlParts = savedAuthor.image.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];

          await this.cloudinaryService.deleteFile(`authors/${publicId}`);
        }
        savedAuthor.image = uploadResult.secure_url;
      }

      await this.authorRepository.save(savedAuthor);
      return {
        success: true,
        message: 'Author updated successfully',
      };
    } catch (error) {
      if (uploadResult) {
        await this.cloudinaryService.deleteFile(uploadResult.public_id);
      }
      console.log(error);

      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    const author = await this.findOne(id);

    const books = await this.bookRepository.find({
      where: { authors: { id } },
    });
    if (books.length > 0) {
      throw new BadRequestException(
        'Author is associated with books and cannot be deleted',
      );
    }
    author.isActive = false;
    await this.authorRepository.save(author);
    return `Author removed`;
  }
}
