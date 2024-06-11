import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/requests/add-to-cart.dto';
import { UpdateCartDto } from './dto/requests/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('cart')
@ApiTags('Cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Throttle({ default: { limit: 2, ttl: 1000 } })
  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    this.cartService.addToCart(addToCartDto);

    return 'Item added to cart';
  }

  @SkipThrottle()
  @Get(':userId/quantity')
  async getCartQuantity(@Param('userId') userId: string): Promise<number> {
    return this.cartService.getCartQuantity(userId);
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post('increase')
  async increaseQuantity(@Body() updateCartDto: UpdateCartDto) {
    await this.cartService.increaseUserCartItemQuantity(
      updateCartDto.userId,
      updateCartDto,
    );

    return 'Item quantity increased';
  }

  @Post('decrease')
  async decreaseQuantity(@Body() updateCartDto: UpdateCartDto) {
    await this.cartService.decreaseUserCartItemQuantity(
      updateCartDto.userId,
      updateCartDto,
    );

    return 'Item quantity decreased';
  }
  @Delete(':userId/item/:bookId')
  async deleteCartItem(
    @Param('userId') userId: string,
    @Param('bookId', new ParseUUIDPipe()) bookId: string,
  ) {
    await this.cartService.deleteCartItem(userId, bookId);
    return `Item with bookId ${bookId} deleted from user's cart`;
  }

  @Delete('clear/:userId')
  async clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
