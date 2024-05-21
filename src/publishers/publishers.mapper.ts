import { Injectable } from '@nestjs/common';
import { PublisherResponseDto } from './dto/responses/publisher-response.dto';
import { Publisher } from './entities/publisher.entity';
import { PublisherResponseForAdminDto } from './dto/responses/publisher-resoponse-for-admin.dto';
import { CreatePublisherDto } from './dto/requests/create-publisher.dto';
import { UpdatePublisherDto } from './dto/requests/update-publisher.dto';

@Injectable()
export class PublisherMapper {
  static toUserResponseDto(publisher: Publisher): PublisherResponseDto {
    const publisherResponseDto = new PublisherResponseDto();
    publisherResponseDto.id = publisher.id;
    publisherResponseDto.name = publisher.name;
    publisherResponseDto.address = publisher.address;
    return publisherResponseDto;
  }

  static toUserResponseForAdminDto(
    publisher: Publisher,
  ): PublisherResponseForAdminDto {
    const publisherResponseDto = new PublisherResponseForAdminDto();
    publisherResponseDto.id = publisher.id;
    publisherResponseDto.name = publisher.name;
    publisherResponseDto.address = publisher.address;
    publisherResponseDto.isActive = publisher.isActive;
    publisherResponseDto.created_at = publisher.created_at;
    publisherResponseDto.updated_at = publisher.updated_at;
    return publisherResponseDto;
  }

  static toUserResponseForAdminDtoList(
    users: Publisher[],
  ): PublisherResponseForAdminDto[] {
    return users.map((user) => this.toUserResponseForAdminDto(user));
  }

  static toUserEntity(createPublisherDto: CreatePublisherDto): Publisher {
    const publisher = new Publisher();
    publisher.name = createPublisherDto.name;
    publisher.address = createPublisherDto.address;
    return publisher;
  }
  static toUpdateUserEntity(
    existingPublisher: Publisher,
    updatePublisherDto: UpdatePublisherDto,
  ): Publisher {
    existingPublisher.name = updatePublisherDto.name ?? existingPublisher.name;
    existingPublisher.address =
      updatePublisherDto.address ?? existingPublisher.address;
    existingPublisher.isActive = true;

    return existingPublisher;
  }
}
