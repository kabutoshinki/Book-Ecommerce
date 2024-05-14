import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductSkusService } from './product_skus.service';
import { CreateProductSkusDto } from './dto/create-product_skus.dto';
import { UpdateProductSkusDto } from './dto/update-product_skus.dto';

@Controller('product-skus')
export class ProductSkusController {
  constructor(private readonly productSkusService: ProductSkusService) {}

  @Post()
  create(@Body() createProductSkusDto: CreateProductSkusDto) {
    return this.productSkusService.create(createProductSkusDto);
  }

  @Get()
  findAll() {
    return this.productSkusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productSkusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductSkusDto: UpdateProductSkusDto) {
    return this.productSkusService.update(+id, updateProductSkusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSkusService.remove(+id);
  }
}
