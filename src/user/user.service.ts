import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';
import { Prisma } from '@prisma/client';
import { EntityDoesNotExist } from '../core/error';


@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({data});
  }

  async findAll(params?: {
    skip?: number,
    take?: number,
    cursor?: Prisma.UserWhereUniqueInput,
    where?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
  }) {
    return await this.prisma.user.findMany(params);
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findUnique({where});
  }

  async update(params: {where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput}) {
    try {
      return await this.prisma.user.update(params);;
    } catch(e) {
      if(e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new EntityDoesNotExist();
        }
      }
      throw e;
    }
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    try {
      return await this.prisma.user.delete({where});;
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
