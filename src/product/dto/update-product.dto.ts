import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, Min } from "class-validator";
import { CategoryValidator } from "./create-product.dto";

@ArgsType()
export class UpdateProductDto {

  @ApiProperty()
  @IsNotEmpty()
  @Field()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(0)
  @Field(type => Number)
  unit_price: number;
  
  @ApiProperty()
  @CategoryValidator
  @Field(type => [String], {nullable: true})
  categories: Prisma.CategoryCreateNestedManyWithoutProductsInput;

}
