import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './order_item.controller';
import { OrderItemService } from './order_item.service';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';

describe('OrderItemController', () => {
  let controller: OrderItemController;
  let service: OrderItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [
        {
          provide: OrderItemService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue(undefined),
            // Uncomment and add mock implementation for create method
            // create: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
    service = module.get<OrderItemService>(OrderItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of order items', async () => {
      expect(await controller.findAll()).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single order item', async () => {
      expect(
        await controller.findOne('67e55044-10b1-426f-9247-bb680e5fe0c8'),
      ).toEqual({});
    });
  });

  describe('update', () => {
    it('should update and return the order item', async () => {
      const updateDto: UpdateOrderItemDto = {
        bookId: '67e55044-10b1-426f-9247-bb680e5fe0c8',
        quantity: 5,
      };
      expect(
        await controller.update(
          '67e55044-10b1-426f-9247-bb680e5fe0c8',
          updateDto,
        ),
      ).toEqual({});
    });
  });

  describe('remove', () => {
    it('should remove the order item', async () => {
      await controller.remove('67e55044-10b1-426f-9247-bb680e5fe0c8');
      expect(service.remove).toHaveBeenCalledWith(
        '67e55044-10b1-426f-9247-bb680e5fe0c8',
      );
    });
  });

  // Uncomment when create method is uncommented in controller and service
  // describe('create', () => {
  //   it('should create and return a new order item', async () => {
  //     const createDto: CreateOrderItemDto = { orderId: '1', bookId: '1', quantity: 2 };
  //     expect(await controller.create(createDto)).toEqual({});
  //   });
  // });
});
