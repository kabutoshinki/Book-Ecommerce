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
import { Role } from '../enums/role.enum';
import { UserResponseForAdminDto } from './dto/response/user-resoponse-for-admin.dto';
import { UpdateUserStateDto } from './dto/requests/update-state-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
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
  async getProfile(userId: string): Promise<UserResponseDto> {
    const userProfile = await this.usersRepository.findOne({
      relations: ['addresses'],
      where: { id: userId },
    });

    return UserMapper.toUserResponseDto(userProfile);
  }

  async getTotalActiveUser(): Promise<number> {
    return await this.usersRepository.count({
      where: { isActive: true, roles: Role.USER },
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find({
      where: { roles: Role.USER },
      relations: ['addresses'],
    });
    return UserMapper.toUserResponseDtoList(users);
  }
  async findAllForAdmin(
    options: IPaginationOptions,
  ): Promise<Pagination<UserResponseForAdminDto>> {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 5;

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.addresses', 'address')
      .where('user.roles = :role', { role: Role.USER })
      .orderBy('user.created_at', 'DESC');

    const [users, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const paginatedUsersDto = UserMapper.toUserResponseForAdminDtoList(users);

    const paginationMeta = {
      totalItems,
      itemCount: users.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };

    return new Pagination<UserResponseForAdminDto>(
      paginatedUsersDto,
      paginationMeta,
    );
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<UserResponseDto> {
    let uploadResult;
    const user = await this.findUserById(id);
    try {
      if (file) {
        uploadResult = await this.cloudinaryService.uploadFile(file, 'users');
        if (user.avatar.startsWith('https://res.cloudinary.com')) {
          const urlParts = user.avatar.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];

          await this.cloudinaryService.deleteFile(`books/${publicId}`);
        }
        user.avatar = uploadResult.secure_url;
      }

      const updatedUser = UserMapper.toUpdateUserEntity(user, updateUserDto);
      const savedUser = await this.usersRepository.save(updatedUser);
      return UserMapper.toUserResponseDto(savedUser);
    } catch (error) {
      if (uploadResult) {
        await this.cloudinaryService.deleteFile(uploadResult.public_id);
      }
    }
  }

  async remove(id: string) {
    const user = await this.findUserById(id);
    user.isActive = false;

    await this.usersRepository.save(user);
    return 'User deleted';
  }
  async changeState(id: string, updateUserStateDto: UpdateUserStateDto) {
    try {
      const user = await this.findUserById(id);

      user.isActive = updateUserStateDto.state;

      await this.usersRepository.save(user);
      return 'User change state success';
    } catch (error) {
      console.log(error);
    }
  }
}
