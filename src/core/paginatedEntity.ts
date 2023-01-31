import { Type } from "@nestjs/common";
import { Field, Int, ObjectType } from "@nestjs/graphql";

export function PaginatedEntity<T>(classRef: Type<T>) {
  @ObjectType({isAbstract: true})
  abstract class PaginatedEntityList {
    @Field(() => Int)
    count: number;

    @Field(() => [classRef])
    data: T[];
  };
  return PaginatedEntityList;
}
