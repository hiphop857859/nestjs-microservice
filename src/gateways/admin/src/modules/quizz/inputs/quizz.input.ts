import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GenerateQuizzInput {
  @Field(() => Int, {
    nullable: false,
  })
  totalQuizz!: number;

  @Field(() => Int, {
    nullable: false,
  })
  indexQuestionName!: number;

  @Field(() => Int, {
    nullable: false,
  })
  questionNumberOfQuizz!: number;

  @Field(() => Int, {
    nullable: false,
  })
  duration!: number;
}

@InputType()
export class ApproveQuizzUgcInput {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;
}

@InputType()
export class RejectQuizzUgcInput {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => String, {
    nullable: true,
  })
  reason!: string;
}
