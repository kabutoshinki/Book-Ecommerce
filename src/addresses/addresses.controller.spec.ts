import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { UsersService } from '../users/users.service';

describe('AddressesController', () => {
  let controller: AddressesController;
  let service: AddressesService;

  const mockAddressService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    selectAddress: jest.fn(),
    findAddressByUserId: jest.fn(),
  };

  const mockAddressRepository = {};
  const mockUsersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        AddressesService,
        {
          provide: getRepositoryToken(Address),
          useValue: mockAddressRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideProvider(AddressesService)
      .useValue(mockAddressService)
      .compile();

    controller = module.get<AddressesController>(AddressesController);
    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return array of addresses', async () => {
    await controller.findAll();
    expect(mockAddressService.findAll).toHaveBeenCalled();
  });

  // Add more tests for other methods if needed
});
