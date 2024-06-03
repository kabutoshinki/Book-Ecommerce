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
} from '@nestjs/common';
import { OrderDetailsService } from './order_details.service';
import { CreateOrderDetailDto } from './dto/requests/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/requests/update-order_detail.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
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
    // const userId = req.user.userId;
    return this.orderDetailsService.createOrderDetail(
      userId,
      createOrderDetailDto,
    );
    // return this.orderDetailsService.create(createOrderDetailDto);
  }

  @Get()
  findAll() {
    return this.orderDetailsService.getAllOrderDetails();
  }

  @Get('order_revenue')
  findOrderRevenue() {
    return this.orderDetailsService.getRevenueByDay();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailsService.getOrderDetailById(id);
  }

  @Get('/user/:id')
  findOrdersByUserId(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailsService.findOrdersByUserId(id);
  }

  @Get(':id/order_items')
  findOrderItemsByOrderId(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailsService.getItemsByOrderId(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailsService.updateOrder(id, updateOrderDetailDto);
  }

  @Patch('change-status/:id')
  change_state(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() state: UpdateOrderStateDto,
  ) {
    return this.orderDetailsService.changeStateOrderDetail(id, state);
  }
}
