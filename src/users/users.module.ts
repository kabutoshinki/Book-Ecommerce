import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Address } from 'src/addresses/entities/address.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Cart, OrderDetail])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
