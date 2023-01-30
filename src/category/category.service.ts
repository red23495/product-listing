import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {

  constructor(private prisma: PrismaService) {}

}