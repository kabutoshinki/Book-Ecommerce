import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/requests/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/requests/update-order_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { Repository } from 'typeorm';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { OrderResponseForAdminDto } from './dto/responses/order-resoponse-for-admin.dto';
import { OrderMapper } from './order_details.mapper';
import { OrderDetailResponseDto } from './dto/responses/order-detail-response.dto';
import { PaymentStatus } from 'src/enums/payment-status.enums';
import { UpdateOrderStateDto } from './dto/requests/update-state-order.dto';
import { OrderItemBooksResponseDto } from 'src/order_item/dto/responses/order-items-books-response';
import { OrderDetailGetItemsResponseDto } from './dto/responses/order-detail-get-items-response.dto';
import { CartService } from 'src/cart/cart.service';
import { OrderResponseDto } from './dto/responses/order-response.dto';
import { OrderGetItemsResponseDto } from './dto/responses/order-get-items-response.dto';
import { subDays } from 'date-fns';
@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly bookService: BooksService,
    private readonly userService: UsersService,
    private readonly cartService: CartService,
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

    const orderItems = createOrderDetailDto.orderItems.map((item) => {
      const book = books.find((book) => book.id === item.bookId);
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.book = book;
      orderItem.quantity = item.quantity;
      return orderItem;
    });
    await this.orderItemRepository.save(orderItems);
    await this.cartService.clearCart(userId);
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

  async getOrderItemsBookByOrderId(
    orderDetailId: string,
  ): Promise<OrderDetailGetItemsResponseDto> {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id: orderDetailId },
      relations: ['items.book'],
    });

    if (!orderDetail) {
      throw new NotFoundException(
        `OrderDetail with id ${orderDetailId} not found`,
      );
    }

    return OrderMapper.toOrderDetailGetItemsResponseDto(orderDetail);
  }
  async getItemsByOrderId(
    orderDetailId: string,
  ): Promise<OrderGetItemsResponseDto> {
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id: orderDetailId },
      relations: ['items.book'],
    });

    if (!orderDetail) {
      throw new NotFoundException(
        `OrderDetail with id ${orderDetailId} not found`,
      );
    }

    return OrderMapper.toOrderIdGetItemsResponseDto(orderDetail);
  }

  async getAllOrderDetails(): Promise<OrderResponseForAdminDto[]> {
    const orders = await this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .leftJoinAndSelect('orderDetail.user', 'user')
      .leftJoinAndSelect('orderDetail.items', 'items')
      .leftJoinAndSelect('user.addresses', 'address')
      .orderBy('address.isSelected', 'DESC')
      .getMany();

    return OrderMapper.toOrderResponseForAdminDtoList(orders);
  }
  async findOne(id: string) {
    return await this.orderDetailRepository.findOneByOrFail({ id });
  }

  async findOrdersByUserId(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .leftJoinAndSelect('orderDetail.user', 'user')
      .leftJoinAndSelect('orderDetail.items', 'items')
      .where('orderDetail.user.id = :userId', { userId })
      .orderBy('orderDetail.created_at', 'DESC')
      .getMany();

    return OrderMapper.toOrderResponseDtoList(orders);
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDetailDto,
  ): Promise<OrderDetail> {
    const order = await this.orderDetailRepository.findOne({
      where: { id: id },
      relations: ['items', 'user'],
    });
    await this.orderItemRepository.delete({ order: { id } });
    const bookIds = await updateOrderDto.orderItems.map((item) => item.bookId);
    const books = await this.bookService.findByIds(bookIds);
    const orderItems = updateOrderDto.orderItems.map((item) => {
      const book = books.find((book) => book.id === item.bookId);
      const orderItem = new OrderItem();
      orderItem.order = order;
      orderItem.book = book;
      orderItem.quantity = item.quantity;
      return orderItem;
    });

    await this.orderItemRepository.save(orderItems);
    return this.orderDetailRepository.save(order);
  }

  async changeStateOrderDetail(
    orderDetailId: string,
    updateOrderStateDto: UpdateOrderStateDto,
  ) {
    const orderDetail = await this.getOrderItemsBookByOrderId(orderDetailId);

    if (updateOrderStateDto.state) {
      orderDetail.status = PaymentStatus.Succeeded;
      await this.updateBookSoldQuantities(orderDetail.item);
    } else {
      orderDetail.status = PaymentStatus.Failed;
    }
    await this.orderDetailRepository.save(orderDetail);
    return {
      success: true,
      message: 'Change status order successfully',
    };
  }

  private async updateBookSoldQuantities(
    orderItems: OrderItemBooksResponseDto[],
  ): Promise<void> {
    const bookIds = orderItems.map((orderItem) => orderItem.book.id);
    const books = await this.bookService.findByIds(bookIds);

    const booksToUpdate = books.map((book) => {
      const correspondingOrderItems = orderItems.filter(
        (item) => item.book.id === book.id,
      );
      const totalQuantity = correspondingOrderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      book.sold_quantity = book.sold_quantity ? Number(book.sold_quantity) : 0;
      book.sold_quantity += totalQuantity;
      return book;
    });

    await Promise.all(
      booksToUpdate.map((book) =>
        this.bookService.update(book.id, book, undefined),
      ),
    );
  }

  async getRevenueByDay(): Promise<any> {
    const endDate = new Date();
    const startDate = subDays(endDate, 6); // Get the date 7 days ago

    const orders = await this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .select('DATE(orderDetail.created_at)', 'date')
      .addSelect('orderDetail.status', 'status')
      .addSelect('SUM(orderDetail.total)', 'total')
      .where('orderDetail.created_at BETWEEN :startDate AND :endDate', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
      .groupBy('DATE(orderDetail.created_at)')
      .addGroupBy('orderDetail.status')
      .orderBy('DATE(orderDetail.created_at)')
      .addOrderBy('orderDetail.status')
      .getRawMany();

    // Organize data by date and status
    const revenueData = {};
    orders.forEach((order) => {
      if (!revenueData[order.date]) {
        revenueData[order.date] = {
          [PaymentStatus.Created]: 0,
          [PaymentStatus.Processing]: 0,
          [PaymentStatus.Succeeded]: 0,
          [PaymentStatus.Failed]: 0,
        };
      }
      revenueData[order.date][order.status] = parseFloat(order.total);
    });

    return revenueData;
  }
}
