import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailsController } from './order_details.controller';
import { OrderDetailsService } from './order_details.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { OrderItem } from '../order_item/entities/order_item.entity';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';

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
          useValue: {}, // Mock service
        },
        {
          provide: UsersService,
          useValue: {}, // Mock service
        },
        {
          provide: CartService,
          useValue: {}, // Mock service
        },
      ],
    }).compile();

    controller = module.get<OrderDetailsController>(OrderDetailsController);
    service = module.get<OrderDetailsService>(OrderDetailsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
