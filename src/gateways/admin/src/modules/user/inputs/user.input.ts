import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserKycInput {
  @Field(() => String, { nullable: true })
  userId!: string;
}

@InputType()
export class UserResetPasswordInput {
  @Field(() => String, { nullable: true })
  userId!: string;
}
