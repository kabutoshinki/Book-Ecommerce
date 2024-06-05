import { Injectable } from '@nestjs/common';
import { PublisherResponseDto } from './dto/responses/publisher-response.dto';
import { Publisher } from './entities/publisher.entity';
import { PublisherResponseForAdminDto } from './dto/responses/publisher-resoponse-for-admin.dto';
import { CreatePublisherDto } from './dto/requests/create-publisher.dto';
import { UpdatePublisherDto } from './dto/requests/update-publisher.dto';
import { formatDate } from '../utils/convert';
@Injectable()
export class PublisherMapper {
  static toPublisherResponseDto(publisher: Publisher): PublisherResponseDto {
    const publisherResponseDto = new PublisherResponseDto();
    publisherResponseDto.id = publisher.id;
    publisherResponseDto.name = publisher.name;
    publisherResponseDto.address = publisher.address;
    return publisherResponseDto;
  }

  static toPublisherResponseForAdminDto(
    publisher: Publisher,
  ): PublisherResponseForAdminDto {
    const publisherResponseDto = new PublisherResponseForAdminDto();
    publisherResponseDto.id = publisher.id;
    publisherResponseDto.name = publisher.name;
    publisherResponseDto.address = publisher.address;
    publisherResponseDto.isActive = publisher.isActive;
    publisherResponseDto.created_at = formatDate(publisher.created_at);
    publisherResponseDto.updated_at = formatDate(publisher.updated_at);
    return publisherResponseDto;
  }

  static toPublisherResponseForAdminDtoList(
    users: Publisher[],
  ): PublisherResponseForAdminDto[] {
    return users.map((user) => this.toPublisherResponseForAdminDto(user));
  }

  static toPublisherEntity(createPublisherDto: CreatePublisherDto): Publisher {
    const publisher = new Publisher();
    publisher.name = createPublisherDto.name;
    publisher.address = createPublisherDto.address;
    return publisher;
  }
  static toUpdatePublisherEntity(
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
