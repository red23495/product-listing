import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe, NotFoundException, UseInterceptors, UploadedFile, HttpCode, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilter } from './product.filter';
import { UpdateProductDto } from './dto/update-product.dto';
import { EntityDoesNotExist } from '../core/error';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from "fs";
import { Public } from '../auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll(@Query() filter: ProductFilter) {
    return await this.productService.paginate(filter);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const model = await this.productService.findOne({id: id});
    if(!model) throw new NotFoundException('Requested Entity Does Not Exist');
    return model;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProductDto) {
    try {
      return await this.productService.update({where: {id}, data});
    } catch (e) {
      if (e instanceof EntityDoesNotExist) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.productService.remove({id});
    } catch (e) {
      if (e instanceof EntityDoesNotExist) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }

  @Post(':id/image/')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: function (req, file, cb) {
        if(!fs.existsSync('upload/')) fs.mkdirSync('upload');
        cb(null, 'upload/')
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
      }
    })
  }))
  @HttpCode(200)
  async uploadImage(@Param('id', ParseIntPipe) id: number, @UploadedFile(
    new ParseFilePipe({
        validators: [
            new FileTypeValidator({fileType: /(jpg|jpeg|png)/}),
        ],
    })
  ) file: Express.Multer.File) {
    try {
      await this.productService.uploadImage(id, file);
      return {message: "Image uploaded successfully"};
    } catch (e) {
      if (e instanceof EntityDoesNotExist) {
        throw new NotFoundException(e.message);
      }
      throw e;
    }
  }
}
