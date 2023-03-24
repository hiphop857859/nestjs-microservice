import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteByAdminResponse {
  @Field(() => Boolean, {
    nullable: false,
  })
  success!: boolean;
}
