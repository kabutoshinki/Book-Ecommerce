import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailsService } from './order_details.service';
import { OrderDetail } from './entities/order_detail.entity';
import { OrderItem } from '../order_item/entities/order_item.entity';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { CartService } from '../cart/cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('OrderDetailsService', () => {
  let service: OrderDetailsService;
  let orderDetailRepository: Repository<OrderDetail>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailsService,
        {
          provide: getRepositoryToken(OrderDetail),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useClass: Repository,
        },
        {
          provide: BooksService,
          useValue: {
            // Add necessary mock methods here
          },
        },
        {
          provide: UsersService,
          useValue: {
            // Add necessary mock methods here
          },
        },
        {
          provide: CartService,
          useValue: {
            // Add necessary mock methods here
          },
        },
      ],
    }).compile();

    service = module.get<OrderDetailsService>(OrderDetailsService);
    orderDetailRepository = module.get<Repository<OrderDetail>>(
      getRepositoryToken(OrderDetail),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrderItemsBookByOrderId', () => {
    it('should throw NotFoundException when order detail not found', async () => {
      const orderDetailId = '1';

      jest.spyOn(orderDetailRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        service.getOrderItemsBookByOrderId(orderDetailId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
