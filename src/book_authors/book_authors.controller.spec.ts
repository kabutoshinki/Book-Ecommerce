import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorsController } from './book_authors.controller';
import { BookAuthorsService } from './book_authors.service';

describe('BookAuthorsController', () => {
  let controller: BookAuthorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookAuthorsController],
      providers: [BookAuthorsService],
    }).compile();

    controller = module.get<BookAuthorsController>(BookAuthorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
