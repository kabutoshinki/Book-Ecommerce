import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { BooksService } from './books/books.service';
import { CategoriesService } from './categories/categories.service';
import { UsersService } from './users/users.service';
import { OrderDetailsService } from './order_details/order_details.service';
import { DiscountsService } from './discounts/discounts.service';
import { AuthorsService } from './authors/authors.service';
import { PublishersService } from './publishers/publishers.service';
import { ReviewsService } from './reviews/reviews.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {};
  const mockBooksService = {
    getTotalActiveBooks: jest.fn(),
    getPopularBooks: jest.fn(),
  };
  const mockCategoriesService = {};
  const mockUsersService = {
    getTotalActiveUser: jest.fn(),
  };
  const mockOrderDetailsService = {
    getRevenueByDay: jest.fn(),
  };
  const mockDiscountsService = {};
  const mockAuthorsService = {};
  const mockPublishersService = {};
  const mockReviewsService = {
    getTotalActiveReviews: jest.fn(),
  };
  const mockCloudinaryService = {};

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: BooksService, useValue: mockBooksService },
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: OrderDetailsService, useValue: mockOrderDetailsService },
        { provide: DiscountsService, useValue: mockDiscountsService },
        { provide: AuthorsService, useValue: mockAuthorsService },
        { provide: PublishersService, useValue: mockPublishersService },
        { provide: ReviewsService, useValue: mockReviewsService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  

  describe('about', () => {
    it('should return about page data', () => {
      const req = { user: {} };
      const result = appController.about(req);

      expect(result).toEqual({ title: 'About Page', user: req.user });
    });
  });

  describe('publicAbout', () => {
    it('should return public about page data', () => {
      const result = appController.publicAbout();

      expect(result).toEqual({ title: 'About Page', layout: false });
    });
  });

  describe('login', () => {
    it('should return login page data', () => {
      const req = {
        query: { errorMessage: 'Error' },
        session: { flash: { errors: 'Some errors' } },
      };
      const result = appController.login(req);

      expect(result).toEqual({
        title: 'Login Page',
        layout: false,
        errors: 'Some errors',
        errorMessage: 'Error',
      });
    });
  });

  // Add more tests for other controller methods as needed
});
