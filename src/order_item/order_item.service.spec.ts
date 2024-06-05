import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order_item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderItem } from './entities/order_item.entity';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { OrderDetailsService } from '../order_details/order_details.service';
import { NotFoundException } from '@nestjs/common';

const mockOrderItem = {
  id: '67e55044-10b1-426f-9247-bb680e5fe0c8',
  quantity: 2,
  order: { id: '67e55044-10b1-426f-9247-bb680e5fe0c8' },
  book: { id: '67e55044-10b1-426f-9247-bb680e5fe0c8' },
};

const mockOrderItemRepository = {
  find: jest.fn().mockResolvedValue([mockOrderItem]),
  findOne: jest.fn().mockResolvedValue(mockOrderItem),
  save: jest.fn().mockResolvedValue(mockOrderItem),
  remove: jest.fn().mockResolvedValue(mockOrderItem),
};

const mockBooksService = {
  findOne: jest.fn().mockResolvedValue({
    id: '67e55044-10b1-426f-9247-bb680e5fe0c8',
    title: 'Mock Book',
  }),
};

const mockOrderDetailsService = {
  findOne: jest.fn().mockResolvedValue({
    id: '67e55044-10b1-426f-9247-bb680e5fe0c8',
    customer: 'Mock Customer',
  }),
};

describe('OrderItemService', () => {
  let service: OrderItemService;
  let repository: Repository<OrderItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemService,
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: OrderDetailsService,
          useValue: mockOrderDetailsService,
        },
      ],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    repository = module.get<Repository<OrderItem>>(
      getRepositoryToken(OrderItem),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of order items', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockOrderItem]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single order item', async () => {
      const result = await service.findOne(
        '67e55044-10b1-426f-9247-bb680e5fe0c8',
      );
      expect(result).toEqual(mockOrderItem);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '67e55044-10b1-426f-9247-bb680e5fe0c8' },
        relations: ['order', 'book'],
      });
    });

    it('should throw an error if order item not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(
        service.findOne('67e55044-10b1-426f-9247-bb680e5fe0c9'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the order item', async () => {
      const updateOrderItemDto = {
        quantity: 5,
        bookId: '67e55044-10b1-426f-9247-bb680e5fe0c8',
      };
      const result = await service.update('1', updateOrderItemDto);
      expect(result).toEqual(mockOrderItem);
      expect(repository.save).toHaveBeenCalledWith({
        ...mockOrderItem,
        quantity: 5,
      });
    });
  });

  describe('remove', () => {
    it('should remove the order item', async () => {
      await service.remove('67e55044-10b1-426f-9247-bb680e5fe0c8');
      expect(repository.remove).toHaveBeenCalledWith(mockOrderItem);
    });
  });
});
