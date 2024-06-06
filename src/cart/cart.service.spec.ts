import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BooksService } from '../books/books.service';

describe('CartService', () => {
  let service: CartService;
  let cacheManagerMock: any;

  beforeEach(async () => {
    cacheManagerMock = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock, // Mock cache manager
        },
        {
          provide: BooksService,
          useValue: {}, // Mock BooksService
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      const addToCartDto = {
        userId: 'testUserId',
        bookId: 'testBookId',
        quantity: 1,
      };
      const cartKey = `cart:${addToCartDto.userId}`;
      const cartItem = {
        bookId: addToCartDto.bookId,
        quantity: addToCartDto.quantity,
      };

      cacheManagerMock.get.mockResolvedValueOnce(null);
      cacheManagerMock.set.mockResolvedValueOnce();

      const result = await service.addToCart(addToCartDto);

      expect(result).toEqual([cartItem]);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(cartKey);
      expect(cacheManagerMock.set).toHaveBeenCalledWith(cartKey, [cartItem]);
    });
  });

  describe('getCartQuantity', () => {
    it('should return cart quantity', async () => {
      const userId = 'testUserId';
      const cartKey = `cart:${userId}`;
      const userCart = [
        { bookId: '1', quantity: 2 },
        { bookId: '2', quantity: 1 },
      ];

      cacheManagerMock.get.mockResolvedValueOnce(userCart);

      const result = await service.getCartQuantity(userId);

      expect(result).toEqual(userCart.length);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(cartKey);
    });

    it('should return 0 if cart is empty', async () => {
      const userId = 'testUserId';
      const cartKey = `cart:${userId}`;

      cacheManagerMock.get.mockResolvedValueOnce([]);

      const result = await service.getCartQuantity(userId);

      expect(result).toEqual(0);
      expect(cacheManagerMock.get).toHaveBeenCalledWith(cartKey);
    });
  });

  describe('clearCart', () => {
    it('should clear user cart', async () => {
      const userId = 'testUserId';
      const cartKey = `cart:${userId}`;

      cacheManagerMock.del.mockResolvedValueOnce();

      await service.clearCart(userId);

      expect(cacheManagerMock.del).toHaveBeenCalledWith(cartKey);
    });
  });

  describe('increaseUserCartItemQuantity', () => {
    it('should increase quantity of user cart item', async () => {
      const userId = 'testUserId';
      const updateCartDto = {
        userId: 'testUserId',
        bookId: 'testBookId',
        quantity: 1,
      };
      const userCart = [{ bookId: 'testBookId', quantity: 1 }];

      cacheManagerMock.get.mockResolvedValueOnce(userCart);
      cacheManagerMock.set.mockResolvedValueOnce();

      await service.increaseUserCartItemQuantity(userId, updateCartDto);

      expect(cacheManagerMock.get).toHaveBeenCalledWith(`cart:${userId}`);
      expect(cacheManagerMock.set).toHaveBeenCalledWith(`cart:${userId}`, [
        { bookId: 'testBookId', quantity: 2 },
      ]);
    });
  });
});
