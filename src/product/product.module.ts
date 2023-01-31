import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/core/prisma.service';
import {UniqueCodeValidation} from "./dto/create-product.dto";
import { CategoryModule } from 'src/category/category.module';
import { ProductResolver } from './product.resolver';

@Module({
  imports: [
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, UniqueCodeValidation, ProductResolver]
})
export class ProductModule {}
