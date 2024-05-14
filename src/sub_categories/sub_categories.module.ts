import { forwardRef, Module } from '@nestjs/common';
import { SubCategoriesService } from './sub_categories.service';
import { SubCategoriesController } from './sub_categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub_category.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory]),
    forwardRef(() => CategoriesModule),
  ],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
  exports: [SubCategoriesService],
})
export class SubCategoriesModule {}
