import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { UsersService } from '../users/users.service';
import { BooksService } from '../books/books.service';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewRepository: Repository<Review>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getRepositoryToken(Review),
          useClass: Repository, // Use the TypeORM Repository class
        },
        {
          provide: UsersService,
          useValue: {}, // Mock UsersService or use a real instance
        },
        {
          provide: BooksService,
          useValue: {}, // Mock BooksService or use a real instance
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get<Repository<Review>>(
      getRepositoryToken(Review),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTotalActiveReviews', () => {
    it('should return the total number of active reviews', async () => {
      const activeReviewsCount = 5; // Provide a mock count of active reviews
      jest
        .spyOn(reviewRepository, 'count')
        .mockResolvedValue(activeReviewsCount);

      expect(await service.getTotalActiveReviews()).toBe(activeReviewsCount);
    });
  });

  // Other tests remain the same
});
