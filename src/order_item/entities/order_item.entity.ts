import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { ProductSku } from 'src/product_skus/entities/product_skus.entity';
import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderDetail, (order) => order.items)
  order: OrderDetail;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;

  @ManyToOne(() => ProductSku, (sku) => sku.orderItems)
  product_sku: ProductSku;

  @Column()
  quantity: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
