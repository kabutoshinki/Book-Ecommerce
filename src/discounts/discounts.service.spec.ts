import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsService } from './discounts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Book } from '../books/entities/book.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/requests/create-discount.dto';
import { UpdateDiscountDto } from './dto/requests/update-discount.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DiscountMapper } from './discounts,mapper';

describe('DiscountsService', () => {
  let service: DiscountsService;
  let discountRepository: Repository<Discount>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountsService,
        {
          provide: getRepositoryToken(Discount),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DiscountsService>(DiscountsService);
    discountRepository = module.get<Repository<Discount>>(
      getRepositoryToken(Discount),
    );
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      const discountEntity = DiscountMapper.toDiscountEntity(createDiscountDto);
      const createdDiscount = { id: '1', ...discountEntity };

      jest
        .spyOn(discountRepository, 'save')
        .mockResolvedValue(createdDiscount as Discount);

      const result = await service.create(createDiscountDto);

      expect(result).toEqual({ success: true, message: 'Discount created' });
      expect(discountRepository.save).toHaveBeenCalledWith(discountEntity);
    });

    it('should handle error when discount name already exists', async () => {
      const createDiscountDto: CreateDiscountDto = {
        name: 'Test Discount',
        amount: 10,
        description: 'Test Description',
        startAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        bookIds: [],
      };

      jest.spyOn(discountRepository, 'save').mockRejectedValue(new Error());

      await expect(service.create(createDiscountDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of discounts', async () => {
      const discounts = [
        {
          id: '1',
          name: 'Discount 1',
          amount: 10,
          description: 'Description 1',
          startAt: new Date(),
          expiresAt: new Date(),
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
          books: [],
        },
        {
          id: '2',
          name: 'Discount 2',
          amount: 20,
          description: 'Description 2',
          startAt: new Date(),
          expiresAt: new Date(),
          isActive: true,
          created_at: new Date(),
          updated_at: new Date(),
          books: [],
        },
      ];

      jest.spyOn(discountRepository, 'find').mockResolvedValue(discounts);

      const result = await service.findAll();

      expect(result).toEqual(
        DiscountMapper.toDiscountResponseDtoList(discounts),
      );
      expect(discountRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { created_at: 'DESC' },
      });
    });
  });
});
