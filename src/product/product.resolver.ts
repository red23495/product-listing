import { Args, Int, Mutation, ObjectType, Query, Resolver } from "@nestjs/graphql";
import { PaginatedEntity } from "src/core/paginatedEntity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductEntity } from "./product.entity";
import { ProductFilter } from "./product.filter";
import { ProductService } from "./product.service";


@ObjectType()
class PaginatedEntityList extends PaginatedEntity(ProductEntity) {}


@Resolver(of => ProductEntity)
export class ProductResolver {

  constructor(private service: ProductService) {}

  @Query(returns => PaginatedEntityList, {name: 'products'})
  async getProducts(@Args() filter: ProductFilter) {
    return await this.service.paginate(filter);
  }

  @Query(returns => ProductEntity, {name: 'product'})
  async getProduct(@Args('id', { type: () => Int }) id: number) {
    return await this.service.findOne({id});
  }

  @Mutation(returns => ProductEntity)
  async createProduct(@Args() data: CreateProductDto) {
    return await this.service.create(data);
  }

  @Mutation(returns => ProductEntity)
  async updateProduct(@Args('id') id: number, @Args() data: UpdateProductDto) {
    return await this.service.update({where: {id}, data});
  }

  @Mutation(returns => ProductEntity)
  async deleteProduct(@Args('id') id: number) {
    return await this.service.remove({id});
  }

}

