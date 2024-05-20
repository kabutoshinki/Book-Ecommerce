import { Address } from 'src/addresses/entities/address.entity';
import { Role } from '../../enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrderDetail } from 'src/order_details/entities/order_detail.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Exclude } from 'class-transformer';

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

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ default: Role.USER })
  roles: Role;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Review, (review) => review.reviewer)
  reviews: Review[];

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.user)
  orderDetails: OrderDetail[];
}
