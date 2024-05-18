import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { OrderItem } from './entities/order_item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/books/books.service';
import { OrderDetailsService } from 'src/order_details/order_details.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly bookService: BooksService,
    private readonly orderDetailService: OrderDetailsService,
  ) {}

  // async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
  //   const { orderId, bookId, quantity } = createOrderItemDto;

  //   const order = await this.orderDetailService.findOne(orderId);
  //   const book = await this.bookService.findOne(bookId);

  //   const orderItem = new OrderItem();
  //   orderItem.order = order;
  //   orderItem.book = book;
  //   orderItem.quantity = quantity;

  //   return this.orderItemRepository.save(orderItem);
  // }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find({ relations: ['order', 'book'] });
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order', 'book'],
    });
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with id ${id} not found`);
    }
    return orderItem;
  }

  async update(
    id: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItem = await this.findOne(id);
    const { quantity } = updateOrderItemDto;
    orderItem.quantity = quantity;
    return this.orderItemRepository.save(orderItem);
  }

  async remove(id: string): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemRepository.remove(orderItem);
  }
}
