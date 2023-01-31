import { Injectable } from "@nestjs/common";
import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsNotEmpty, Min, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ProductService } from "../product.service";


@ValidatorConstraint({name: 'uniqueCode', async: true})
@Injectable()
export class UniqueCodeValidation implements ValidatorConstraintInterface {

  constructor(private productService: ProductService) {}

  async validate(value: any, validationArguments?: ValidationArguments) {
    if(!value) return false;
    const product = await this.productService.findOne({code: value});
    return !product;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    if(!validationArguments.value) return 'Product code must not be empty';
    return `Product with given code already exists`;
  }

}

export const CategoryValidator = (target: Object, propertyKey: string | symbol) => {
  Transform(
    ({value}) => {
      if(!Array.isArray(value)) return;
      return ({connectOrCreate: value.map(cat => ({create: {name: String(cat)}, where: {name: String(cat)}}))});
    }
  )(target, propertyKey);
  IsNotEmpty({message: "Categories should be a list of strings"})(target, propertyKey);
}


@ArgsType()
export class CreateProductDto {

  @IsNotEmpty()
  @Field()
  @ApiProperty()
  name: string;

  @Field()
  @Validate(UniqueCodeValidation)
  @ApiProperty()
  code: string;

  @Field(type => Number)
  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  unit_price: number;

  @CategoryValidator
  @Field(type => [String], {nullable: true})
  @ApiProperty()
  categories: Prisma.CategoryCreateNestedManyWithoutProductsInput;

}
