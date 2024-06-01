import { Address } from './entities/address.entity';
import { AddressResponseDto } from './dto/responses/address-response-dto';

export class AddressMapper {
  static toAddressResponseDto(address: Address): AddressResponseDto {
    const addressResponseDto = new AddressResponseDto();
    addressResponseDto.id = address.id;
    addressResponseDto.title = address.title;
    addressResponseDto.address_line_1 = address.address_line_1;
    addressResponseDto.address_line_2 = address.address_line_2;
    addressResponseDto.city = address.city;
    addressResponseDto.phone_number = address.phone_number;
    addressResponseDto.isSelected = address.isSelected;
    return addressResponseDto;
  }

  static toAddressResponseDtoList(addresses: Address[]): AddressResponseDto[] {
    if (!addresses) return [];
    return addresses.map((address) => this.toAddressResponseDto(address));
  }
}
