import { Inject, Injectable } from '@nestjs/common';
import { AddToCartDto } from './dto/requests/add-to-cart.dto';
import { UpdateCartDto } from './dto/requests/update-cart.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CartItem } from './interfaces/CartItem';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class CartService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private bookService: BooksService,
  ) {}

  private getCartKey(userId: string): string {
    return `cart:${userId}`;
  }
  async addToCart(addToCartDto: AddToCartDto): Promise<CartItem[]> {
    const cartKey = this.getCartKey(addToCartDto.userId);
    const cart: CartItem[] = (await this.cacheManager.get(cartKey)) || [];
    const itemIndex = cart.findIndex(
      (item) => item.bookId === addToCartDto.bookId,
    );

    if (itemIndex > -1) {
      cart[itemIndex].quantity += addToCartDto.quantity;
    } else {
      cart.push({
        bookId: addToCartDto.bookId,
        quantity: addToCartDto.quantity,
      });
    }

    await this.cacheManager.set(cartKey, cart);
    return cart;
  }
  // async getCart(userId: string) {
  //   const cartKey = this.getCartKey(userId);
  //   return (await this.cacheManager.get(cartKey)) || [];
  // }

  async getCart(userId: string): Promise<CartItem[]> {
    const cartKey = this.getCartKey(userId);
    const cart: CartItem[] = (await this.cacheManager.get(cartKey)) || [];

    // Extract bookIds from cart
    const bookIds = cart.map((item) => item.bookId);

    // Fetch books based on bookIds
    const books = await this.bookService.findByIds(bookIds);

    // Combine cart items with book information
    const cartWithBooks: CartItem[] = cart.map((item) => {
      const book = books.find((book) => book.id === item.bookId);
      return { ...item, book };
    });

    return cartWithBooks;
  }

  async clearCart(userId: string) {
    const cartKey = this.getCartKey(userId);
    await this.cacheManager.del(cartKey);
  }

  private getUserCartKey(userId: string): string {
    return `cart:user:${userId}`;
  }

  async increaseUserCartItemQuantity(
    userId: string,
    updateCartDto: UpdateCartDto,
  ) {
    const userCartKey = this.getCartKey(userId);
    const userCart =
      ((await this.cacheManager.get(userCartKey)) as CartItem[]) || [];

    const updatedCart = userCart.map((item) => {
      if (item.bookId === updateCartDto.bookId) {
        item.quantity += updateCartDto.quantity;
      }
      return item;
    });

    await this.cacheManager.set(userCartKey, updatedCart);
  }

  async decreaseUserCartItemQuantity(
    userId: string,
    updateCartDto: UpdateCartDto,
  ) {
    const userCartKey = this.getCartKey(userId);
    const userCart =
      ((await this.cacheManager.get(userCartKey)) as CartItem[]) || [];

    const updatedCart = userCart.map((item) => {
      if (item.bookId === updateCartDto.bookId) {
        item.quantity -= updateCartDto.quantity;
        // Ensure quantity doesn't go below 0
        item.quantity = Math.max(0, item.quantity);
      }
      return item;
    });

    await this.cacheManager.set(userCartKey, updatedCart);
  }

  async deleteCartItem(userId: string, bookId: string) {
    const userCartKey = this.getCartKey(userId);
    const userCart =
      ((await this.cacheManager.get(userCartKey)) as CartItem[]) || [];

    const updatedCart = userCart.filter((item) => item.bookId !== bookId);

    await this.cacheManager.set(userCartKey, updatedCart);
  }

  async mergeCarts(guestCartKey: string, userCartKey: string): Promise<void> {
    const guestCart: CartItem[] =
      (await this.cacheManager.get(guestCartKey)) || [];
    const userCart: CartItem[] =
      (await this.cacheManager.get(userCartKey)) || [];

    for (const item of guestCart) {
      const itemIndex = userCart.findIndex(
        (cartItem) => cartItem.bookId === item.bookId,
      );
      if (itemIndex > -1) {
        userCart[itemIndex].quantity += item.quantity;
      } else {
        userCart.push(item);
      }
    }

    await this.cacheManager.set(userCartKey, userCart);
    await this.cacheManager.del(guestCartKey);
  }
}
