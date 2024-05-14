import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.carts)
  user: User;

  @Column()
  total: number;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
