import { IsAdminGuard } from './../guard/is-admin.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { CreateOrderDetailDto } from './dto/requests/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/requests/update-order_detail.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { UpdateOrderStateDto } from './dto/requests/update-state-order.dto';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  createOrder(
    @Param('userId') userId: string,
    @Body() createOrderDetailDto: CreateOrderDetailDto,
  ) {
    return this.orderDetailsService.createOrderDetail(
      userId,
      createOrderDetailDto,
    );
    // return this.orderDetailsService.create(createOrderDetailDto);
  }

  @UseGuards(IsAdminGuard)
  @Get('order_revenue')
  findOrderRevenue() {
    return this.orderDetailsService.getRevenueByDay();
  }

  @UseGuards(IsAdminGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailsService.getOrderDetailById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  findOrdersByUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailsService.findOrdersByUserId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/order_items')
  findOrderItemsByOrderId(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailsService.getItemsByOrderId(id);
  }

  @UseGuards(IsAdminGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailsService.updateOrder(id, updateOrderDetailDto);
  }

  @UseGuards(IsAdminGuard)
  @Patch('change-status/:id')
  change_state(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() state: UpdateOrderStateDto,
  ) {
    return this.orderDetailsService.changeStateOrderDetail(id, state);
  }
}
