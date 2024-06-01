import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { CreateAddressDto } from './dto/requests/create-address.dto';
import { UpdateAddressDto } from './dto/requests/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly userService: UsersService,
  ) {}
  async create(createAddressDto: CreateAddressDto) {
    const user = await this.userService.findById(createAddressDto.userId);
    const address = this.addressRepository.create({
      ...createAddressDto,
      user,
    });
    await this.addressRepository.save(address);
    return 'Address created';
  }

  findAll() {
    return this.addressRepository.find();
  }

  async selectAddress(userId: string, addressId: string) {
    const addresses = await this.findAddressByUserId(userId);

    for (const address of addresses) {
      address.isSelected = address.id === addressId;
      await this.addressRepository.save(address);
    }
    return 'Address selected';
  }

  async findOne(id: string) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }
  async findAddressByUserId(userId: string) {
    await this.userService.findById(userId);
    return await this.addressRepository.find({
      where: { user: { id: userId } },
    });
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOne(id);
    Object.assign(address, updateAddressDto);
    await this.addressRepository.save(address);
    return 'Address updated';
  }

  async remove(id: string) {
    const address = await this.findOne(id);
    this.addressRepository.remove(address);
    return 'Address deleted';
  }
}
