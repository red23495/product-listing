import { ArgsType, Field } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";
import { QueryFilter, QueryParam } from "../core/filter";

@ArgsType()
export class ProductFilter extends QueryFilter<Prisma.ProductWhereInput, Prisma.ProductOrderByWithRelationInput> {

  protected $fields: any[] = ['search', 'categories']

  @QueryParam
  @Field({nullable: true})
  search?: string;

  @Field(() => [String], {nullable: true})
  @QueryParam
  categories?: string[] | string

  filter_search(query, value) {
    query.OR = [
      {name: {contains: value, mode: 'insensitive',}},
      {code: {contains: value, mode: 'insensitive',}},
    ]
  }

  filter_categories(query, value) {
    query.categories = {
      some: {
        name : {
          in: Array.isArray(value)?value:[value]
        }
      }
    }
  }
}