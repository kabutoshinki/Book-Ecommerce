import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/requests/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/requests/update-order_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { Repository } from 'typeorm';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { PublicUser } from 'src/types/PublicUser.type';
import { OrderResponseForAdminDto } from './dto/responses/order-resoponse-for-admin.dto';
import { OrderMapper } from './order_details.mapper';
import { OrderDetailResponseDto } from './dto/responses/order-detail-response.dto';
import { PaymentStatus } from 'src/enums/payment-status.enums';
import { UpdateOrderStateDto } from './dto/requests/update-state-order.dto';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly bookService: BooksService,
    private readonly userService: UsersService,
  ) {}
  async createOrderDetail(
    userId: string,
    createOrderDetailDto: CreateOrderDetailDto,
  ) {
    const user = await this.userService.findUserById(userId);
    const bookIds = await createOrderDetailDto.orderItems.map(
      (item) => item.bookId,
    );

    const books = await this.bookService.findByIds(bookIds);
    const newOrder = new OrderDetail();
    newOrder.user = user;
    newOrder.total = createOrderDetailDto.totalAmount;
    const order = await this.orderDetailRepository.save(newOrder);

    await Promise.all(
      createOrderDetailDto.orderItems.map(async (item) => {
        const book = books.find((book) => book.id === item.bookId);
        const orderItem = new OrderItem();
        orderItem.order = order;
        orderItem.book = book; // Replace with logic to get book
        orderItem.quantity = item.quantity;
        await this.orderItemRepository.save(orderItem);
      }),
    );
    return 'Order created';
  }

  async getOrderDetailById(
    orderDetailId: string,
  ): Promise<OrderDetailResponseDto> {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id: orderDetailId },
      relations: ['user', 'user.addresses', 'items.book'],
    });

    if (!orderDetail) {
      throw new NotFoundException(
        `OrderDetail with id ${orderDetailId} not found`,
      );
    }

    return OrderMapper.toOrderDetailResponseDto(orderDetail);
  }
  async getAllOrderDetails(): Promise<OrderResponseForAdminDto[]> {
    const orders = await this.orderDetailRepository.find({
      relations: ['items', 'user', 'user.addresses'],
    });

    return OrderMapper.toOrderResponseForAdminDtoList(orders);
  }

  async findOne(id: string) {
    return await this.orderDetailRepository.findOneByOrFail({ id: id });
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDetailDto,
  ): Promise<OrderDetail> {
    const order = await this.orderDetailRepository.findOne({
      where: { id: id },
      relations: ['items', 'user'],
    });
    await this.orderItemRepository.delete({ id: id });
    const bookIds = await updateOrderDto.orderItems.map((item) => item.bookId);
    const books = await this.bookService.findByIds(bookIds);
    await Promise.all(
      updateOrderDto.orderItems.map(async (item) => {
        const book = books.find((book) => book.id === item.bookId);
        const orderItem = new OrderItem();
        orderItem.order = order;
        orderItem.book = book; // Replace with logic to get book
        orderItem.quantity = item.quantity;
        await this.orderItemRepository.save(orderItem);
      }),
    );
    return await this.orderDetailRepository.save(order);
  }

  async changeStateOrderDetail(
    orderDetailId: string,
    updateOrderStateDto: UpdateOrderStateDto,
  ) {
    const orderDetail = await this.findOne(orderDetailId);

    if (updateOrderStateDto.state) {
      orderDetail.status = PaymentStatus.Succeeded;
    } else {
      orderDetail.status = PaymentStatus.Failed;
    }
    await this.orderDetailRepository.save(orderDetail);
    return {
      success: true,
      message: 'Change status order successfully',
    };
  }
}
