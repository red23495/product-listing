import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';
import { Prisma } from '@prisma/client';
import { ProductFilter } from './product.filter'
import { EntityDoesNotExist } from '../core/error';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductService {

  constructor(private prisma: PrismaService) {}
    
  async create(data: Prisma.ProductCreateInput) {
    return new ProductEntity(await this.prisma.product.create({data, include: {categories: true}}));
  }

  async findAll(params?: {
    skip?: number,
    take?: number,
    cursor?: Prisma.ProductWhereUniqueInput,
    where?: Prisma.ProductWhereInput,
    orderBy?: Prisma.ProductOrderByWithRelationInput,
    include?: Prisma.ProductInclude,
  }) {
    return (await this.prisma.product.findMany(params)).map(model => new ProductEntity(model));
  }

  async paginate(filter: ProductFilter) {
    const data = await this.findAll({...filter.build(), include: {categories: true}});
    const count = await this.prisma.product.count({where: filter.build().where});
    return {
      data,
      count
    }
  }

  async findOne(where: Prisma.ProductWhereUniqueInput) {
    const model = await this.prisma.product.findUnique({where, include: {categories: true}});
    if(!model) return;
    return new ProductEntity(model);
  }

  async update(params: {where: Prisma.ProductWhereUniqueInput, data: Prisma.ProductUpdateInput}) {
    try {
      await this.prisma.product.update({...params, data: {categories: {deleteMany: {}}}});
      return new ProductEntity(await this.prisma.product.update({...params, include: {categories: true}}));
    } catch(e) {
      if(e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new EntityDoesNotExist();
        }
      }
      throw e;
    }
  }

  async remove(where: Prisma.ProductWhereUniqueInput) {
    try {
      return new ProductEntity(await this.prisma.product.delete({where, include: {categories: true}}));
    } catch(e) {
      if(e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new EntityDoesNotExist();
        }
      }
      throw e;
    }
  }

  async uploadImage(id: number, file: Express.Multer.File) {
    try {
      await this.prisma.product.update({where: {id: id}, data: {image: file.filename}});
    } catch(e) {
      if(e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new EntityDoesNotExist();
        }
      }
      throw e;
    }
  }
}