import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { OrderItem } from 'src/order_item/entities/order_item.entity';
import { ProductSku } from 'src/product_skus/entities/product_skus.entity';
import { SubCategory } from 'src/sub_categories/entities/sub_category.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  summary: string;

  @Column()
  image: string;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  category: SubCategory;

  @OneToMany(() => ProductSku, (sku) => sku.product)
  product_skus: ProductSku[];

  @ManyToMany(() => Wishlist)
  @JoinTable()
  wishlists: Wishlist[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
