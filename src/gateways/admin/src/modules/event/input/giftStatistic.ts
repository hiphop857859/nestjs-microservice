import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GiftStatisticInput {
  @Field(() => String, {
    nullable: false,
  })
  sessionSpinId!: string;
}
