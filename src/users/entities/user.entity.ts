import { Address } from 'src/addresses/entities/address.entity';
import { Role } from '../../enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderDetail } from 'src/order_details/entities/order_detail.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default:
      'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png',
  })
  avatar: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  // @Column()
  // birth_of_date: Date;

  // @Column()
  // phone_number: string;

  @Column({ default: Role.USER })
  roles: Role;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.user)
  orderDetails: OrderDetail[];
}
