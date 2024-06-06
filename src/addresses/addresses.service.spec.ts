import { Test, TestingModule } from '@nestjs/testing';
import { AddressesService } from './addresses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';

describe('AddressesService', () => {
  let service: AddressesService;

  const mockAddressRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = module.get<AddressesService>(AddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an address', async () => {
    const mockCreateAddressDto = {
      userId: '1',
      title: 'Home',
      city: 'HCM',
      phone_number: '0989644849',
    }; // Mocked DTO
    const mockUser = {}; // Mocked user
    mockUsersService.findById.mockResolvedValue(mockUser);

    await service.create(mockCreateAddressDto);

    expect(mockUsersService.findById).toHaveBeenCalled();
    expect(mockAddressRepository.create).toHaveBeenCalledWith(
      expect.objectContaining(mockCreateAddressDto),
    );
    expect(mockAddressRepository.save).toHaveBeenCalled();
  });

  it('should find all addresses', async () => {
    await service.findAll();
    expect(mockAddressRepository.find).toHaveBeenCalled();
  });

  it('should select an address for a user', async () => {
    const mockUserId = '1'; // Mocked user ID
    const mockAddressId = '2'; // Mocked address ID
    const mockAddresses = [{ id: '1' }, { id: '2' }]; // Mocked addresses
    mockAddressRepository.find.mockResolvedValue(mockAddresses);

    await service.selectAddress(mockUserId, mockAddressId);

    expect(mockAddressRepository.find).toHaveBeenCalledWith({
      where: { user: { id: mockUserId } },
      order: { isSelected: 'DESC' },
    });
    expect(mockAddressRepository.save).toHaveBeenCalled();
  });

  it('should find one address by ID', async () => {
    const mockId = '1'; // Mocked ID
    const mockAddress = { id: '1' }; // Mocked address
    mockAddressRepository.findOne.mockResolvedValue(mockAddress);

    const result = await service.findOne(mockId);

    expect(result).toEqual(mockAddress);
    expect(mockAddressRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId },
    });
  });

  it('should find addresses by user ID', async () => {
    const mockUserId = '1'; // Mocked user ID
    const mockAddresses = [{ id: '1' }, { id: '2' }]; // Mocked addresses
    mockAddressRepository.find.mockResolvedValue(mockAddresses);
    mockUsersService.findById.mockResolvedValue({ id: '1' });

    const result = await service.findAddressByUserId(mockUserId);

    expect(result).toEqual(mockAddresses);
    expect(mockAddressRepository.find).toHaveBeenCalledWith({
      where: { user: { id: mockUserId } },
      order: { isSelected: 'DESC' },
    });
    expect(mockUsersService.findById).toHaveBeenCalledWith(mockUserId);
  });

  it('should update an address', async () => {
    const mockId = '1'; // Mocked ID
    const mockUpdateAddressDto = {}; // Mocked DTO
    const mockAddress = { id: '1' }; // Mocked address
    mockAddressRepository.findOne.mockResolvedValue(mockAddress);

    await service.update(mockId, mockUpdateAddressDto);

    expect(mockAddressRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId },
    });
    expect(mockAddressRepository.save).toHaveBeenCalled();
  });

  it('should remove an address', async () => {
    const mockId = '1'; // Mocked ID
    const mockAddress = { id: '1' }; // Mocked address
    mockAddressRepository.findOne.mockResolvedValue(mockAddress);

    await service.remove(mockId);

    expect(mockAddressRepository.findOne).toHaveBeenCalledWith({
      where: { id: mockId },
    });
    expect(mockAddressRepository.remove).toHaveBeenCalledWith(mockAddress);
  });

  it('should throw NotFoundException if address not found', async () => {
    const mockId = '1'; // Mocked ID
    mockAddressRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(mockId)).rejects.toThrowError(
      NotFoundException,
    );
  });

  // Add more test cases if needed
});
