import { ObjectType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class StatisticsEarnResponse {
  @Field(() => GraphQLJSON, {
    nullable: true,
  })
  result: any;
}

@ObjectType()
export class StatisticsPlaytimeResponse {
  @Field(() => GraphQLJSON, {
    nullable: true,
  })
  result: any;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 0,
  })
  total: number;
}
