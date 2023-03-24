import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class statisticsEarnInput {
  @Field(() => String, { nullable: false })
  userId: string;

  @Field(() => Int, { nullable: false })
  days: number;
}

@InputType()
export class statisticsPlaytimeInput {
  @Field(() => String, { nullable: false })
  userId: string;

  @Field(() => Int, { nullable: false })
  days: number;
}
