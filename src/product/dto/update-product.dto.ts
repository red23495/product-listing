import { ArgsType, Field } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";
import { IsNotEmpty, Min } from "class-validator";
import { CategoryValidator } from "./create-product.dto";

@ArgsType()
export class UpdateProductDto {

  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @Min(0)
  @Field(type => Number)
  unit_price: number;
  
  @CategoryValidator
  @Field(type => [String], {nullable: true})
  categories: Prisma.CategoryCreateNestedManyWithoutProductsInput;

}
