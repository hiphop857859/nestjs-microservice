import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ImportQuestionCsv {
  @Field(() => Boolean, {
    nullable: true,
  })
  success!: boolean;
}
@ObjectType()
export class UpdateAllTotalCategoryQuestion {
  @Field(() => Boolean, {
    nullable: true,
  })
  success!: boolean;
}
