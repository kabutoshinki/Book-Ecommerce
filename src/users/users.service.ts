import {
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserDetailDto } from './dto/user-detail.dto';
import { User } from './entities/user.entity';
import { error } from 'console';
import { UserResponseDto } from './dto/response/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    userDTO.password = await bcrypt.hash(userDTO.password, salt);
    userDTO.avatar = userDTO.avatar
      ? userDTO.avatar
      : 'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png';
    const user = await this.usersRepository.save(userDTO);
    delete user.password;
    delete user.roles;
    return user;
  }

  async createByEmail(userDetail: UserDetailDto): Promise<User> {
    const newUser = await this.usersRepository.save(userDetail);

    return newUser;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(data: Partial<User>): Promise<User> {
    return await this.usersRepository.findOneBy({ email: data.email });
  }
  async findById(@Param('id') userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        error: 'User not exist',
        status: HttpStatus.NOT_FOUND,
      });
    }
    const { id, firstName, lastName, avatar, email } = user;
    return { id, firstName, lastName, avatar, email };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException({ message: 'User Not Found' });
    }
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.avatar = updateUserDto.avatar;
    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException({ message: `User with ID ${id} not found` });
    }
  }
}
