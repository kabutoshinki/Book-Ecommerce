import { PartialType } from '@nestjs/swagger';
import { CreateProductSkusDto } from './create-product_skus.dto';

export class UpdateProductSkusDto extends PartialType(CreateProductSkusDto) {}
