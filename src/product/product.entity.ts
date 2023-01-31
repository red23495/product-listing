import { Field, Int, ObjectType, Float } from "@nestjs/graphql";
import { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { Exclude, Expose, Transform } from "class-transformer";
import { forOwn } from "lodash";
import { CategoryEntity } from "../category/category.entity";

@ObjectType()
export class ProductEntity implements Product {

  constructor(model) {
    // A proxy seems better suited
    // Response format and entity should be seperate
    forOwn(model, (v, k) => this[k] = v);
    if(this.categories) {
      this.categories = this.categories.map(cat => new CategoryEntity(cat));
    }
  }

  @Exclude()
  image: string;

  @Field(type => Int)
  id: number;

  @Field()
  name: string;
  
  @Field()
  code: string;

  @Transform(({value}) => Number.parseFloat(value))
  @Expose()
  @Field(type => Float)
  unit_price: Decimal;
  
  @Exclude()
  categories: CategoryEntity[];

  @Expose()
  @Field(type => [String], {nullable: true})
  get category_list() {
    return this.categories?this.categories.map(item => item.name):[];
  }

  @Expose()
  @Field(type => String, {nullable: true})
  get image_link() {
    if (!this.image) return; 
    return `/static/${this.image}`;
  }
}