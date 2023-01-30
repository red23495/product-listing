import { Prisma } from "@prisma/client";
import { IsNotEmpty, Min } from "class-validator";
import { CategoryValidator } from "./create-product.dto";

export class UpdateProductDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Min(0)
  unit_price: number;
  
  @CategoryValidator
  categories: Prisma.CategoryCreateNestedManyWithoutProductsInput;

}
