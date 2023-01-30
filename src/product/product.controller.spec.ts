import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EntityDoesNotExist } from '../core/error';
import { ProductFilter } from './product.filter';
import { NotFoundException } from '@nestjs/common';

const mockProductService = () => ({
  create: jest.fn().mockResolvedValue({}),
  paginate: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue({}),
  uploadImage: jest.fn().mockResolvedValue({}),
});

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useFactory: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    it('should call productService.create with the createProductDto', async () => {
      const createProductDto = new CreateProductDto();
      await controller.create(createProductDto);
      expect(productService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should call productService.paginate with the filter', async () => {
      const filter = new ProductFilter();
      await controller.findAll(filter);
      expect(productService.paginate).toHaveBeenCalledWith(filter);
    });
  });

  describe('findOne', () => {
    it('should call productService.findOne with the id', async () => {
      const id = 1;
      await controller.findOne(id);
      expect(productService.findOne).toHaveBeenCalledWith({id});
    });
  });

  describe('update', () => {
    it('should call productService.update with the id and data', async () => {
      const id = 1;
      const data = new UpdateProductDto();
      await controller.update(id, data);
      expect(productService.update).toHaveBeenCalledWith({where: {id}, data});
    });
  });

  describe('remove', () => {
    it('should call productService.remove with the id', async () => {
      const id = 1;
      await controller.remove(id);
      expect(productService.remove).toHaveBeenCalledWith({id});
    });
  });
  describe('uploadImage', () => {
    it('should return a success message for successful upload', async () => {
      jest.spyOn(productService, 'uploadImage').mockImplementation(async () => {});
      const result = await controller.uploadImage(1, {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from([]),
        size: 0,
        stream: null,
        destination: '',
        filename: 'file.jpg',
        path: './',
      });
      expect(result).toEqual({ message: 'Image uploaded successfully' });
    });

    it('should throw a NotFoundException if entity does not exist', async () => {
      jest.spyOn(productService, 'uploadImage').mockImplementation(() => {
        throw new EntityDoesNotExist('Requested Entity Does Not Exist');
      });
      await expect(controller.uploadImage(1, {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from([]),
        size: 0,
        stream: null,
        destination: '',
        filename: 'file.jpg',
        path: './',
      })).rejects.toThrow(NotFoundException);
    });
  });
});