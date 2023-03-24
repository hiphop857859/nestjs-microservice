import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ImportQuestionCsvInput {
  @Field(() => String, {
    nullable: false,
  })
  docId!: string;

  @Field(() => String, {
    nullable: false,
  })
  sheetId!: string;

  @Field(() => Int, {
    nullable: false,
  })
  limit!: number;

  @Field(() => Int, {
    nullable: false,
  })
  offset!: number;
}
