import { ArgsType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { Prisma } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsIn, ValidateIf } from "class-validator";
import { isFunction, forOwn } from "lodash";

export const QueryParam = (target: Object, propertyKey: string | symbol) => {
  Transform(({value}) => value === ''?undefined:value)(target, propertyKey);
  ValidateIf((obj, value) => value !== undefined)(target, propertyKey);
}

export const QueryInt = Transform(({ value }) => {
  const ret = parseInt(value);
  if(Number.isNaN(ret)) return undefined;
  return ret;
});

@ArgsType()
export class QueryFilter<T_W extends Record<string, any>, T_O extends Record<string, any>> {

  protected $fields: string[] = [];

  @QueryParam
  @QueryInt
  @Field({defaultValue: 0})
  @ApiProperty({required: false})
  skip: number = 0;

  @QueryParam
  @QueryInt
  @Field({defaultValue: 10})
  @ApiProperty({required: false})
  take: number = 10;

  @Transform(() => undefined)
  @QueryParam
  @ApiProperty({required: false})
  orderBy?: undefined;

  @QueryParam
  @ApiProperty({required: false})
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  buildWhere () {
    let query: Record<string, any> = {};
    this.$fields.forEach((field) => {
      const filter = this[field];
      if(!filter) return;
      if(isFunction(this[`filter_${String(field)}`])) {
        this[`filter_${String(field)}`](query, filter);
      } else {
        query[field] = filter;
      }
    })
    // we needed to provide some dynamicity here
    // it's the responsibility of the developer to make sure no ill typed data is provided
    return query as T_W; 
  }

  build() {
    return {
      skip: this.skip,
      take: this.take,
      where: this.buildWhere(),
      orderBy: this.buildOrderBy(),
    }
  }


  buildOrderBy() {
    if (!this.orderBy) return;
    // we ensure this fields integrity by ensuring orderBy and order fields proper validation
    return {[this.orderBy]: this.order ?? Prisma.SortOrder.asc} as T_O; 
  }

}