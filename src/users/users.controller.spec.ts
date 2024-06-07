import { IsAdminGuard } from './../guard/is-admin.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { UpdateUserStateDto } from './dto/requests/update-state-user.dto';
import { Role } from '../enums/role.enum';
import { NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    changeState: jest.fn(),
    remove: jest.fn(),
    getProfile: jest.fn(),
  };

  const user = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    avatar: 'avatar.img',
    username: 'johndoe',
    roles: [Role.USER],
    password: 'password',
    isActive: true,
    created_at: new Date(),
    updated_at: new Date(),
    addresses: [],
    reviews: [],
    orderDetails: [],
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: IsAdminGuard,
          useValue: {}, // Mock implementation of IsAdminGuard if needed
        },
      ],
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

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        username: 'john@example.com',
        avatar: 'john@example.com',
        password: 'password',
      };
      mockUsersService.create.mockResolvedValue(user);

      expect(await usersController.create(createUserDto)).toBe(user);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([user]);

      expect(await usersController.findAll()).toEqual([user]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('getProfile', () => {
    it('should return a user profile', async () => {
      const userId = '1';
      mockUsersService.getProfile.mockResolvedValue(user);

      expect(await usersController.getProfile(userId)).toBe(user);
      expect(mockUsersService.getProfile).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const userId = '1';
      mockUsersService.findById.mockResolvedValue(user);

      expect(await usersController.findOne(userId)).toBe(user);
      expect(mockUsersService.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      const userId = '1';
      mockUsersService.findById.mockResolvedValue(null);

      try {
        await usersController.findOne(userId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
      const file = {} as Express.Multer.File;
      const updatedUser = { ...user, ...updateUserDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      expect(await usersController.update(userId, updateUserDto, file)).toBe(
        updatedUser,
      );
      expect(mockUsersService.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
        file,
      );
    });
  });

  describe('changeState', () => {
    it('should change the state of a user', async () => {
      const userId = '1';
      const updateUserStateDto: UpdateUserStateDto = { state: false };
      const updatedUser = { ...user, ...updateUserStateDto };
      mockUsersService.changeState.mockResolvedValue(updatedUser);

      expect(
        await usersController.changeState(userId, updateUserStateDto),
      ).toBe(updatedUser);
      expect(mockUsersService.changeState).toHaveBeenCalledWith(
        userId,
        updateUserStateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      mockUsersService.remove.mockResolvedValue({});

      expect(await usersController.remove(userId)).toEqual({});
      expect(mockUsersService.remove).toHaveBeenCalledWith(userId);
    });
  });
});
