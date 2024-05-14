import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from '../enums/role.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpStatus, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findById: jest.fn(
      (id) =>
        ({
          id: id,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          avatar: 'avatar.img',
        } || null),
    ),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });
  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should return array of users', () => {
    expect(usersController.findAll());
    expect(mockUsersService.findAll).toHaveBeenCalledWith();
  });

  it('should return one user equal with id', () => {
    const userId = 1;
    const expectedUser = {
      id: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: 'avatar.img',
    };
    expect(usersController.findOne(userId)).toStrictEqual(expectedUser);
    expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
  });
});
