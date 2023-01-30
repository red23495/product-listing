import { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { Exclude, Expose, Transform } from "class-transformer";
import { forOwn } from "lodash";

export class ProductEntity implements Product {

  constructor(model) {
    // A proxy seems better suited
    // Response format and entity should be seperate
    forOwn(model, (v, k) => this[k] = v);
  }

  @Exclude()
  image: string;

  id: number;

  name: string;
  
  code: string;

  @Transform(({value}) => Number.parseFloat(value))
  @Expose()
  unit_price: Decimal;
  
  @Exclude()
  categories: any[];

  @Expose()
  get category_list() {
    return this.categories?this.categories.map(item => item.name):[];
  }

  @Expose()
  get image_link() {
    if (!this.image) return; 
    return `/static/${this.image}`;
  }
}