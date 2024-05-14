import { Test, TestingModule } from '@nestjs/testing';
import { ProductSkusController } from './product_skus.controller';
import { ProductSkusService } from './product_skus.service';

describe('ProductSkusController', () => {
  let controller: ProductSkusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSkusController],
      providers: [ProductSkusService],
    }).compile();

    controller = module.get<ProductSkusController>(ProductSkusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
