import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.wishlists)
  user: User;

  @ManyToOne(() => Product, (product) => product.wishlists)
  product: Product;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
