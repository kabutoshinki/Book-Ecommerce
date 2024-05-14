import { Module } from '@nestjs/common';
import { ProductSkusService } from './product_skus.service';
import { ProductSkusController } from './product_skus.controller';

@Module({
  controllers: [ProductSkusController],
  providers: [ProductSkusService],
})
export class ProductSkusModule {}
