import { UpdateUserDto } from './dto/requests/update-user.dto';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/response/user-response.dto';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UserResponseForAdminDto } from './dto/response/user-resoponse-for-admin.dto';
import { AddressMapper } from 'src/addresses/addresses.mapper';

@Injectable()
export class UserMapper {
  static toUserResponseDto(user: User): UserResponseDto {
    const userResponseDto = new UserResponseDto();
    userResponseDto.id = user.id;
    userResponseDto.firstName = user.firstName;
    userResponseDto.lastName = user.lastName;
    userResponseDto.avatar = user.avatar;
    userResponseDto.email = user.email;
    if (user.addresses) {
      userResponseDto.address = AddressMapper.toAddressResponseDtoList(
        user.addresses,
      );
    }
    return userResponseDto;
  }

  static toUserResponseForAdminDto(user: User): UserResponseForAdminDto {
    const userResponseDto = new UserResponseForAdminDto();
    userResponseDto.id = user.id;
    userResponseDto.firstName = user.firstName;
    userResponseDto.lastName = user.lastName;
    userResponseDto.avatar = user.avatar;
    userResponseDto.email = user.email;
    userResponseDto.isActive = user.isActive;
    userResponseDto.address = AddressMapper.toAddressResponseDtoList(
      user.addresses,
    );
    userResponseDto.created_at = user.created_at;
    userResponseDto.updated_at = user.updated_at;
    return userResponseDto;
  }

  static toUserResponseDtoList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toUserResponseDto(user));
  }
  static toUserResponseForAdminDtoList(
    users: User[],
  ): UserResponseForAdminDto[] {
    return users.map((user) => this.toUserResponseForAdminDto(user));
  }

  static toUserEntity(createUserDto: CreateUserDto): User {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.username = createUserDto.username;
    user.avatar = createUserDto.avatar
      ? createUserDto.avatar
      : 'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png';
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    return user;
  }
  static toUpdateUserEntity(
    existingUser: User,
    updateUserDto: UpdateUserDto,
  ): User {
    existingUser.firstName = updateUserDto.firstName ?? existingUser.firstName;
    existingUser.lastName = updateUserDto.lastName ?? existingUser.lastName;
    existingUser.password = updateUserDto.password ?? existingUser.password;
    return existingUser;
  }
}
