import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailsController } from './order_details.controller';
import { OrderDetailsService } from './order_details.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { OrderItem } from '../order_item/entities/order_item.entity';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';
import { OrderDetailResponseDto } from './dto/responses/order-detail-response.dto';
import { PaymentStatus } from '../enums/payment-status.enums';

describe('OrderDetailsController', () => {
  let controller: OrderDetailsController;
  let service: OrderDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailsController],
      providers: [
        OrderDetailsService,
        {
          provide: getRepositoryToken(OrderDetail),
          useValue: {}, // Mock repository
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: {}, // Mock repository
        },
        {
          provide: BooksService,
          useValue: { findOne: jest.fn() }, // Mock BooksService.findOne
        },
        {
          provide: UsersService,
          useValue: { findOne: jest.fn() }, // Mock UsersService.findOne
        },
        {
          provide: CartService,
          useValue: {}, // Mock service
        },
      ],
    }).compile();

    controller = module.get<OrderDetailsController>(OrderDetailsController);
    service = module.get<OrderDetailsService>(OrderDetailsService);

    // Mock getOrderDetailById method
    service.getOrderDetailById = jest.fn();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should call service method with correct parameter', async () => {
      const orderId = 'testOrderId';

      await controller.findOne(orderId);

      expect(service.getOrderDetailById).toHaveBeenCalledWith(orderId);
    });

    it('should return the response from service method', async () => {
      const orderId = 'testOrderId';
      const expectedResponse: OrderDetailResponseDto = {
        id: 'testOrderId',
        status: PaymentStatus.Processing, // Fill in with appropriate status
        total: 100, // Fill in with appropriate total
        quantity: 2, // Fill in with appropriate quantity
        user: {
          id: '1',
          firstName: '1',
          lastName: '1',
          username: '1',
          avatar: '1',
          email: '1',
          address: [],
        },
        item: [
          {
            id: '1',
            book: {
              id: '1',
              title: '1',
              description: '1',
              summary: '1',
              price: 1,
              image: 'abc',
              categoryIds: ['1'],
              authorIds: ['1'],
            },
            quantity: 2,
          },
        ],
        created_at: '2022-06-09T12:00:00Z', // Fill in with appropriate timestamp
        updated_at: '2022-06-09T12:00:00Z', // Fill in with appropriate timestamp
      };
      (service.getOrderDetailById as jest.Mock).mockResolvedValue(
        expectedResponse,
      );

      const response = await controller.findOne(orderId);

      expect(response).toEqual(expectedResponse);
    });
  });
});
