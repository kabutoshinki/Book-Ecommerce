import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { UsersService } from '../users/users.service';
import { CreateAddressDto } from './dto/requests/create-address.dto';
import { UpdateAddressDto } from './dto/requests/update-address.dto';

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

  it('should return a single address by id', async () => {
    const mockId = '1'; // Mocked ID
    await controller.findOne(mockId);
    expect(mockAddressService.findOne).toHaveBeenCalledWith(mockId);
  });

  it('should create a new address', async () => {
    const mockCreateAddressDto: CreateAddressDto = {
      userId: '1',
      title: 'Home',
      city: 'HCM',
      phone_number: '0989644849',
    }; // Mocked DTO
    await controller.create(mockCreateAddressDto);
    expect(mockAddressService.create).toHaveBeenCalledWith(
      mockCreateAddressDto,
    );
  });

  it('should update an existing address', async () => {
    const mockId = '1'; // Mocked ID
    const mockUpdateAddressDto: UpdateAddressDto = {}; // Mocked DTO
    await controller.update(mockId, mockUpdateAddressDto);
    expect(mockAddressService.update).toHaveBeenCalledWith(
      mockId,
      mockUpdateAddressDto,
    );
  });

  it('should remove an address', async () => {
    const mockId = '1'; // Mocked ID
    await controller.remove(mockId);
    expect(mockAddressService.remove).toHaveBeenCalledWith(mockId);
  });

  it('should select an address for a user', async () => {
    const mockId = '1'; // Mocked ID
    const mockUserId = '2'; // Mocked User ID
    await controller.addressSelected(mockId, mockUserId);
    expect(mockAddressService.selectAddress).toHaveBeenCalledWith(
      mockUserId,
      mockId,
    );
  });

  it('should find addresses by user ID', async () => {
    const mockUserId = '1'; // Mocked User ID
    await controller.findAddressByUserId(mockUserId);
    expect(mockAddressService.findAddressByUserId).toHaveBeenCalledWith(
      mockUserId,
    );
  });
});
