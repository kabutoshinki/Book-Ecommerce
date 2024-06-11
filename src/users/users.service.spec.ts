import { LockService } from './../lock/lock.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { validate } from 'class-validator';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let cloudinaryService: CloudinaryService;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };
  const mockLockService = {
    acquireLock: jest.fn(),
    releaseLock: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
        { provide: LockService, useValue: mockLockService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CreateUserDto', () => {
    let createUserDto: CreateUserDto;

    beforeEach(() => {
      createUserDto = new CreateUserDto();
    });

    it('should be defined', () => {
      expect(createUserDto).toBeDefined();
    });

    describe('validation', () => {
      it('should pass validation with valid data', async () => {
        createUserDto.firstName = 'John';
        createUserDto.lastName = 'Doe';
        createUserDto.username = 'johndoe';
        createUserDto.email = 'john@example.com';
        createUserDto.password = 'password123';

        const errors = await validate(createUserDto);
        expect(errors.length).toBe(0);
      });

      it('should fail validation if firstName is missing', async () => {
        createUserDto.lastName = 'Doe';
        createUserDto.username = 'johndoe';
        createUserDto.email = 'john@example.com';
        createUserDto.password = 'password123';

        const errors = await validate(createUserDto);
        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });
});
