import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../core/prisma.service';
import { EntityDoesNotExist } from '../core/error';
import { Prisma } from '@prisma/client';
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';


describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>()
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should return created user', async () => {
      const data: Prisma.UserCreateInput = {
        username: 'testuser', password: 'password',
      };
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).user.create.mockResolvedValueOnce(data);
      const result = await userService.create(data);
      expect(result.username).toBe('testuser');
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const data = [
        { username: 'testuser1', password: 'password',},
        { username: 'testuser2', password: 'password',},
      ];
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).user.findMany.mockResolvedValueOnce(data);
      const result = await userService.findAll();
      expect(result[0].username).toBe('testuser1');
      expect(result[1].username).toBe('testuser2');
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const data = { id: 1, username: 'testuser1', password: 'password',};
      (prismaService as DeepMockProxy<PrismaService>).user.findUnique.mockResolvedValueOnce(data);
      const result = await userService.findOne({ id: 1 });
      expect(result.username).toBe(data.username);
    });

    it('should return undefined if user not found', async () => {
      const result = await userService.findOne({ id: 1 });
      expect(result).toBeUndefined();
    });
  });
  describe('update', () => {
    it('should return updated user', async () => {
      const data: Prisma.UserCreateInput =  { username: 'testuser1', password: 'password',};
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).user.update.mockResolvedValue(data);
      const result = await userService.update({where: {id: 1}, data});
      expect(result.username).toBe('testuser1');
    });
    it('should throw error if not found', async () => {
      const data: Prisma.UserCreateInput = { username: 'testuser1', password: 'password',};
      (prismaService as DeepMockProxy<PrismaService>).user.update.mockImplementationOnce(
        () => {throw new PrismaClientKnownRequestError('error', {code: 'P2025', clientVersion: '1'})}
      );
      const result = async () => await userService.update({where: {id: 1}, data});
      await expect(result).rejects.toThrow(EntityDoesNotExist);
    });
  });
  describe('remove', () => {
    it('should return removed user', async () => {
      const data = { username: 'testuser1', password: 'password',};
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).user.delete.mockResolvedValueOnce(data);
      const result = await userService.remove({id: 1});
      expect(result.username).toBe('testuser1');
    });
    it('should throw error if not found', async () => {
      (prismaService as DeepMockProxy<PrismaService>).user.delete.mockImplementationOnce(
        () => {throw new PrismaClientKnownRequestError('error', {code: 'P2025', clientVersion: '1'})}
      );
      const result = async () => await userService.remove({id: 1});
      await expect(result).rejects.toThrow(EntityDoesNotExist);
    });
  });
});