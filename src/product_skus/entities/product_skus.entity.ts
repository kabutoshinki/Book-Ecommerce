import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class ProductSku {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.product_skus)
  product: Product;

  @Column()
  size_attribute_id: number;

  @Column()
  color_attribute_id: number;

  @Column()
  sku: string;

  @Column()
  price: string;

  @Column()
  quantity: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product_sku) // Define the relationship here
  orderItems: OrderItem[]; // This property should exist

  @OneToMany(() => CartItem, (cartItem) => cartItem.sku) // Define the relationship here
  cartItems: CartItem[];

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
