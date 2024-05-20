import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserDetailDto } from './dto/requests/user-detail.dto';
import { User } from './entities/user.entity';
import { error } from 'console';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UserMapper } from './users.mapper';
import { Role } from 'src/enums/role.enum';
import { UserResponseForAdminDto } from './dto/response/user-resoponse-for-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDto): Promise<UserResponseDto> {
    try {
      const userEntity = UserMapper.toUserEntity(userDTO);
      const salt = await bcrypt.genSalt();
      userEntity.password = await bcrypt.hash(userEntity.password, salt);
      const savedUser = await this.usersRepository.save(userEntity);

      return UserMapper.toUserResponseDto(savedUser);
    } catch (error) {
      throw new BadRequestException('username or email is already exits');
    }
  }

  async createByEmail(userDetail: UserDetailDto): Promise<UserResponseDto> {
    const newUser = await this.usersRepository.save(userDetail);

    return UserMapper.toUserResponseDto(newUser);
  }

  async findAll(): Promise<UserResponseForAdminDto[]> {
    const users = await this.usersRepository.find({
      where: { roles: Role.USER },
    });
    return UserMapper.toUserResponseForAdminDtoList(users);
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

    return UserMapper.toUserResponseDto(user);
  }
  async findUserById(@Param('id') userId: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        error: 'User not exist',
        status: HttpStatus.NOT_FOUND,
      });
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id);
    const updatedUser = UserMapper.toUpdateUserEntity(user, updateUserDto);

    return await this.usersRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException({ message: `User with ID ${id} not found` });
    }
  }
}
