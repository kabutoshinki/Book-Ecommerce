import { forwardRef, Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategoriesModule } from 'src/sub_categories/sub_categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => SubCategoriesModule),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
