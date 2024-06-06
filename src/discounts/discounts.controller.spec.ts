import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Book } from '../books/entities/book.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/requests/create-discount.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateDiscountDto } from './dto/requests/update-discount.dto';

describe('DiscountsController', () => {
  let controller: DiscountsController;
  let service: DiscountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountsController],
      providers: [
        {
          provide: DiscountsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DiscountsController>(DiscountsController);
    service = module.get<DiscountsService>(DiscountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a discount', async () => {
      const createDiscountDto: CreateDiscountDto = {
        name: 'Test Discount',
        amount: 10,
        description: 'Test Description',
        startAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        bookIds: [],
      };
      const result = { success: true, message: 'Discount created' };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createDiscountDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createDiscountDto);
    });

    it('should handle service errors', async () => {
      const createDiscountDto: CreateDiscountDto = {
        name: 'Test Discount',
        amount: 10,
        description: 'Test Description',
        startAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        bookIds: [],
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.create(createDiscountDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of discounts', async () => {
      const result = [
        {
          id: '1',
          name: 'Discount 1',
          amount: 10,
          description: 'Test Description',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a discount by id', async () => {
      const updateDiscountDto: UpdateDiscountDto = {
        name: 'Updated Discount',
        amount: 15,
        description: 'Updated Description',
        startAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        bookIds: [],
      };
      const result = { success: true, message: 'Discount updated' };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateDiscountDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('1', updateDiscountDto);
    });

    it('should handle not found exception', async () => {
      const updateDiscountDto: UpdateDiscountDto = {
        name: 'Updated Discount',
        amount: 15,
        description: 'Updated Description',
        startAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        bookIds: [],
      };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('1', updateDiscountDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
