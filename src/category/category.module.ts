import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/core/prisma.service';

@Module({
  controllers: [],
  providers: [CategoryService, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
