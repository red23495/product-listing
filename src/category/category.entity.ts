import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Category } from "@prisma/client";
import { forOwn } from "lodash";

@ObjectType()
export class CategoryEntity implements Category {

  constructor(model) {
    forOwn(model, (v, k) => this[k] = v);
  }

  @Field(type => Int)
  id: number;
  
  @Field()
  name: string;

}