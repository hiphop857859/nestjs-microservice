import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class LeaderBoardNewManyInput {
  @Field(() => String, {
    nullable: false,
  })
  eventId!: string;
}

@InputType()
export class CreateLeaderBoardNewManyInput extends LeaderBoardNewManyInput {}

@InputType()
export class UpdateLeaderBoardNewManyInput extends LeaderBoardNewManyInput {
  @Field(() => [DataLeaderBoardNewManyInput], {
    nullable: false,
  })
  data!: DataLeaderBoardNewManyInput[];
}

@InputType()
export class DataLeaderBoardNewManyInput {
  @Field(() => String, {
    nullable: false,
  })
  _id!: string;
  @Field(() => Int, {
    nullable: false,
  })
  order!: number;
}
