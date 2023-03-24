import { Category } from '@metahop/graphql';
import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class Player {
  @Field(() => String, {
    nullable: true,
  })
  _id!: string;

  @Field(() => String, {
    nullable: true,
  })
  email!: string;

  @Field(() => Float, {
    nullable: true,
    defaultValue: 0,
  })
  level!: number;

  @Field(() => String, { nullable: true })
  avatar!: string;

  @Field(() => String, { nullable: false })
  username!: string;

  @Field(() => String, { nullable: true })
  nickname!: string;

  @Field(() => String, { nullable: true })
  bio!: string;

  @Field(() => Float, {
    nullable: true,
    defaultValue: 0,
  })
  viewedCount: number;

  @Field(() => Float, {
    nullable: true,
    defaultValue: 0,
  })
  likedCount: number;

  @Field(() => Boolean, {
    nullable: true,
  })
  isLiked: boolean;
}

@ObjectType()
export class PlayerResultResponse {
  @Field(() => Float, {
    nullable: false,
    defaultValue: 0,
  })
  EXP: number;

  @Field(() => Float, {
    nullable: false,
    defaultValue: 0,
  })
  accuracy: number;
}

@ObjectType()
class PlayerQuizCategoryItem {
  @Field(() => Category, {
    nullable: true,
  })
  category: Category;

  @Field(() => Int, {
    nullable: true,
  })
  count: number;
}

@ObjectType()
export class PlayerQuizCategroryResponse {
  @Field(() => [PlayerQuizCategoryItem], {
    nullable: true,
  })
  result: PlayerQuizCategoryItem[];
}

@ObjectType()
export class PlayerActionLikeReponse {
  @Field(() => Boolean, {
    nullable: false,
  })
  success: boolean;
}

@ObjectType()
export class PlayerActionViewReponse {
  @Field(() => Boolean, {
    nullable: false,
  })
  success: boolean;
}
