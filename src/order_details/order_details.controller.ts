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
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @Request() req,
    @Body() createOrderDetailDto: CreateOrderDetailDto,
  ) {
    const userId = req.user.userId;
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

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailsService.getOrderDetailById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailsService.updateOrder(id, updateOrderDetailDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailsService.deleteOrderDetail(id);
  }
}
