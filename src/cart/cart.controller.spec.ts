import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BooksService } from '../books/books.service';
import { AddToCartDto } from './dto/requests/add-to-cart.dto';
import { UpdateCartDto } from './dto/requests/update-cart.dto';

describe('CartController', () => {
  let controller: CartController;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        CartService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          }, // Mock cache manager
        },
        {
          provide: BooksService,
          useValue: {
            findByIds: jest.fn(), // Mock function as needed
          }, // Mock BooksService
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addToCart', () => {
    it('should add item to cart', async () => {
      const addToCartDto: AddToCartDto = {
        userId: 'testUserId',
        bookId: 'testBookId',
        quantity: 1,
      };

      jest.spyOn(cartService, 'addToCart').mockResolvedValueOnce(undefined);

      const result = await controller.addToCart(addToCartDto);

      expect(result).toEqual('Item added to cart');
      expect(cartService.addToCart).toHaveBeenCalledWith(addToCartDto);
    });
  });

  describe('getCartQuantity', () => {
    it('should return cart quantity', async () => {
      const userId = 'testUserId';
      const cartQuantity = 5;

      jest
        .spyOn(cartService, 'getCartQuantity')
        .mockResolvedValueOnce(cartQuantity);

      const result = await controller.getCartQuantity(userId);

      expect(result).toEqual(cartQuantity);
      expect(cartService.getCartQuantity).toHaveBeenCalledWith(userId);
    });
  });

  describe('getCart', () => {
    it('should return user cart', async () => {
      const userId = 'testUserId';
      const userCart = [
        { bookId: '1', quantity: 2 },
        { bookId: '2', quantity: 1 },
      ];

      jest.spyOn(cartService, 'getCart').mockResolvedValueOnce(userCart);

      const result = await controller.getCart(userId);

      expect(result).toEqual(userCart);
      expect(cartService.getCart).toHaveBeenCalledWith(userId);
    });
  });

  describe('increaseQuantity', () => {
    it('should increase quantity of user cart item', async () => {
      const updateCartDto: UpdateCartDto = {
        userId: 'testUserId',
        bookId: 'testBookId',
        quantity: 1,
      };

      jest
        .spyOn(cartService, 'increaseUserCartItemQuantity')
        .mockResolvedValueOnce();

      const result = await controller.increaseQuantity(updateCartDto);

      expect(result).toEqual('Item quantity increased');
      expect(cartService.increaseUserCartItemQuantity).toHaveBeenCalledWith(
        updateCartDto.userId,
        updateCartDto,
      );
    });
  });

  describe('decreaseQuantity', () => {
    it('should decrease quantity of user cart item', async () => {
      const updateCartDto: UpdateCartDto = {
        userId: 'testUserId',
        bookId: 'testBookId',
        quantity: 1,
      };

      jest
        .spyOn(cartService, 'decreaseUserCartItemQuantity')
        .mockResolvedValueOnce();

      const result = await controller.decreaseQuantity(updateCartDto);

      expect(result).toEqual('Item quantity decreased');
      expect(cartService.decreaseUserCartItemQuantity).toHaveBeenCalledWith(
        updateCartDto.userId,
        updateCartDto,
      );
    });
  });

  describe('deleteCartItem', () => {
    it('should delete item from user cart', async () => {
      const userId = 'testUserId';
      const bookId = 'testBookId';

      jest.spyOn(cartService, 'deleteCartItem').mockResolvedValueOnce();

      const result = await controller.deleteCartItem(userId, bookId);

      expect(result).toEqual(
        `Item with bookId ${bookId} deleted from user's cart`,
      );
      expect(cartService.deleteCartItem).toHaveBeenCalledWith(userId, bookId);
    });
  });
});
