import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { PLAYER_ACTION_LIKE } from '@metahop/core';

registerEnumType(PLAYER_ACTION_LIKE, {
  name: 'PlayerActionLikeType',
});

@InputType()
export class PlayerInfoInput {
  @Field(() => String, { nullable: false })
  id!: string;
}

@InputType()
export class PlayerResultInput {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => Int, { nullable: true })
  days!: number;
}

@InputType()
export class PlayerQuizCategoryInput {
  @Field(() => String, { nullable: false })
  id!: string;
}

@InputType()
export class PlayerActionLikeInput {
  @Field(() => String, { nullable: false })
  playerId!: string;

  @Field(() => PLAYER_ACTION_LIKE, { nullable: false })
  value!: string;
}

@InputType()
export class PlayerActionViewInput {
  @Field(() => String, { nullable: false })
  playerId!: string;
}
