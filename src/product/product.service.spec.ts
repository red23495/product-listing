import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../core/prisma.service';
import { EntityDoesNotExist } from '../core/error';
import { ProductEntity } from './product.entity';
import { Prisma } from '@prisma/client';
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { ProductFilter } from './product.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';


describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>()
        }
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);

  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('create', () => {
    it('should return created product', async () => {
      const data: Prisma.ProductCreateInput = {
        name: 'Product1', code: 'PRO_001', unit_price: 10,
        categories: {
          connectOrCreate: [
            {where: {name: 'catA'}, create: {name: 'catA'}},
            {where: {name: 'catB'}, create: {name: 'catB'}},
          ]
        } 
      };
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).product.create.mockResolvedValueOnce({
        ...data, categories: [{name: 'catA', id: 1}, {name: 'catB', id:2}]
      });
      const result = await productService.create(data);
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.name).toBe('Product1');
      expect(result.code).toBe('PRO_001');
    });
  });

  describe('findAll', () => {
    it('should find all products', async () => {
      const data = [
        { name: 'Product1', code: 'PRO_001', unit_price: 10, categories: [],},
        { name: 'Product2', code: 'PRO_002', unit_price: 10, categories: [],},
      ];
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).product.findMany.mockResolvedValueOnce(data);
      const result = await productService.findAll();
      result.forEach(item => expect(item).toBeInstanceOf(ProductEntity));
      expect(result[0].name).toBe('Product1');
      expect(result[0].code).toBe('PRO_001');
      expect(result[1].name).toBe('Product2');
      expect(result[1].code).toBe('PRO_002');
    });
  });

  describe('paginate', () => {
    it('should paginate products', async () => {
      const data = [
        { name: 'Product1', code: 'PRO_001', unit_price: 10, categories: [],},
        { name: 'Product2', code: 'PRO_002', unit_price: 10, categories: [],},
      ];
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).product.findMany.mockResolvedValueOnce(data);
      (prismaService as DeepMockProxy<PrismaService>).product.count.mockResolvedValueOnce(2);
      const result = await productService.paginate(new ProductFilter());
      expect(result.data).toHaveLength(2);
      result.data.forEach(item => expect(item).toBeInstanceOf(ProductEntity));
      expect(result.data[0].name).toBe('Product1');
      expect(result.data[0].code).toBe('PRO_001');
      expect(result.data[1].name).toBe('Product2');
      expect(result.data[1].code).toBe('PRO_002');
      expect(result.count).toBe(2);
    });
  });

  describe('findOne', () => {
    it('should find a product by id', async () => {
      const data = { id: 1, name: 'Product1', code: 'PRO_001', unit_price: 10, categories: [],};
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).product.findUnique.mockResolvedValueOnce(data);
      const result = await productService.findOne({ id: 1 });
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.name).toBe(data.name);
      expect(result.code).toBe(data.code);
    });

    it('should return undefined if product not found', async () => {
      const result = await productService.findOne({ id: 1 });
      expect(result).toBeUndefined();
    });
  });
  describe('update', () => {
    it('should return updated product', async () => {
      const data: Prisma.ProductCreateInput = {
        name: 'Product1', code: 'PRO_001', unit_price: 10,
        categories: {
          connectOrCreate: [
            {where: {name: 'catA'}, create: {name: 'catA'}},
            {where: {name: 'catB'}, create: {name: 'catB'}},
          ]
        } 
      };
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).product.update.mockResolvedValue({
        ...data, categories: [{name: 'catA', id: 1}, {name: 'catB', id:2}]
      });
      const result = await productService.update({where: {id: 1}, data});
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.name).toBe('Product1');
      expect(result.code).toBe('PRO_001');
    });
    it('should throw error if not found', async () => {
      const data: Prisma.ProductCreateInput = {
        name: 'Product1', code: 'PRO_001', unit_price: 10,
        categories: {
          connectOrCreate: [
            {where: {name: 'catA'}, create: {name: 'catA'}},
            {where: {name: 'catB'}, create: {name: 'catB'}},
          ]
        } 
      };
      (prismaService as DeepMockProxy<PrismaService>).product.update.mockImplementationOnce(
        () => {throw new PrismaClientKnownRequestError('error', {code: 'P2025', clientVersion: '1'})}
      );
      const result = async () => await productService.update({where: {id: 1}, data});
      await expect(result).rejects.toThrow(EntityDoesNotExist);
    });
  });
  describe('remove', () => {
    it('should return removed product', async () => {
      const data = {
        name: 'Product1', code: 'PRO_001', unit_price: 10,
        categories: [{name: 'catA', id: 1}, {name: 'catB', id:2}]
      };
      // @ts-expect-error 
      (prismaService as DeepMockProxy<PrismaService>).product.delete.mockResolvedValueOnce(data);
      const result = await productService.remove({id: 1});
      expect(result).toBeInstanceOf(ProductEntity);
      expect(result.name).toBe('Product1');
      expect(result.code).toBe('PRO_001');
    });
    it('should throw error if not found', async () => {
      (prismaService as DeepMockProxy<PrismaService>).product.delete.mockImplementationOnce(
        () => {throw new PrismaClientKnownRequestError('error', {code: 'P2025', clientVersion: '1'})}
      );
      const result = async () => await productService.remove({id: 1});
      await expect(result).rejects.toThrow(EntityDoesNotExist);
    });
  });
  describe('upload', () => {
    it('returns nothing', async () => {
      const result = await productService.uploadImage(1, {filename: 'a'} as any); // avoid error
      expect(result).toBeUndefined();
    });
    it('should throw error if not found', async () => {
      (prismaService as DeepMockProxy<PrismaService>).product.update.mockImplementationOnce(
        () => {throw new PrismaClientKnownRequestError('error', {code: 'P2025', clientVersion: '1'})}
      );
      const result = async () => await productService.uploadImage(1, {filename: 'a'} as any); // avoid error
      await expect(result).rejects.toThrow(EntityDoesNotExist);
    });
  });
  
});