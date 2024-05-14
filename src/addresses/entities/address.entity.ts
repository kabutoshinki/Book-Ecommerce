import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  address_line_1: string;

  @Column()
  address_line_2: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  postal_code: string;

  @Column()
  landmark: string;

  @Column()
  phone_number: string;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
