import { RedisManageService } from './../redis/redis.service';
import { PaymentUpdateOrderStateDto } from './dto/requests/payment-update-state-order.dto';
import { PaymentService } from './../payment/payment.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/requests/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/requests/update-order_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { Repository } from 'typeorm';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { OrderItem } from '../order_item/entities/order_item.entity';
import { OrderResponseForAdminDto } from './dto/responses/order-resoponse-for-admin.dto';
import { OrderMapper } from './order_details.mapper';
import { OrderDetailResponseDto } from './dto/responses/order-detail-response.dto';
import { PaymentStatus } from '../enums/payment-status.enums';
import { UpdateOrderStateDto } from './dto/requests/update-state-order.dto';
import { OrderItemBooksResponseDto } from '../order_item/dto/responses/order-items-books-response';
import { OrderDetailGetItemsResponseDto } from './dto/responses/order-detail-get-items-response.dto';
import { CartService } from '../cart/cart.service';
import { OrderResponseDto } from './dto/responses/order-response.dto';
import { OrderGetItemsResponseDto } from './dto/responses/order-get-items-response.dto';
import { subDays } from 'date-fns';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
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
    private readonly paymentService: PaymentService,
    private readonly redisService: RedisManageService,
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
    if (
      createOrderDetailDto?.type_method === 'Default' ||
      createOrderDetailDto?.type_method === undefined
    ) {
      if (!(createOrderDetailDto.checkout_method === 'buynow')) {
        await this.cartService.deleteItemsFromCart(`user-${userId}`, bookIds);
      }
      return 'Order created';
    } else {
      await this.cartService.deleteItemsFromCart(`user-${userId}`, bookIds);
      const paymentUrl = await this.paymentService.createPayment(
        newOrder.total,
        newOrder.id,
        createOrderDetailDto.type_method,
      );

      return { message: 'Order created', paymentUrl };
    }
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
    const cacheKey = `order_item_${orderDetailId}`;
    const cachedItems = await this.redisService.get(cacheKey);

    if (cachedItems) {
      return cachedItems;
    }
    console.log('go here');
    const orderDetail = await this.orderDetailRepository.findOne({
      where: { id: orderDetailId },
      relations: ['items.book'],
    });

    if (!orderDetail) {
      throw new NotFoundException(
        `OrderDetail with id ${orderDetailId} not found`,
      );
    }

    await this.redisService.set(
      cacheKey,
      OrderMapper.toOrderIdGetItemsResponseDto(orderDetail),
      20,
    );

    return OrderMapper.toOrderIdGetItemsResponseDto(orderDetail);
  }

  async paginateOrderAdmin(
    options: IPaginationOptions,
  ): Promise<Pagination<OrderResponseForAdminDto>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 5;

    const queryBuilder = this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .leftJoinAndSelect('orderDetail.user', 'user')
      .leftJoinAndSelect('orderDetail.items', 'items')
      .leftJoinAndSelect('user.addresses', 'address')
      .orderBy({
        'orderDetail.created_at': 'DESC',
        'address.isSelected': 'DESC',
      });

    const [orders, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const paginatedOrdersDto =
      OrderMapper.toOrderResponseForAdminDtoList(orders);

    const paginationMeta = {
      totalItems: totalItems,
      itemCount: orders.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };

    return new Pagination<OrderResponseForAdminDto>(
      paginatedOrdersDto,
      paginationMeta,
    );
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
  async paymentChangeStateOrderDetail(
    orderDetailId: string,
    updateOrderStateDto: PaymentUpdateOrderStateDto,
  ) {
    const orderDetail = await this.getOrderItemsBookByOrderId(orderDetailId);

    orderDetail.status = updateOrderStateDto.state;
    await this.updateBookSoldQuantities(orderDetail.item);

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

    // Organize data by status
    const revenueData = {
      [PaymentStatus.Processing]: 0,
      [PaymentStatus.Succeeded]: 0,
      [PaymentStatus.Failed]: 0,
    };

    orders.forEach((order) => {
      revenueData[order.status] += parseFloat(order.total);
    });

    return revenueData;
  }
}
