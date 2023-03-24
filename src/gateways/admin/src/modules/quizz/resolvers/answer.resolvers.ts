import {
  AnswerMessagePattern,
  QuestionMessagePattern,
  CurrentUser,
  AdminJwtAuthGuard,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  AnswerQueryInput,
  CreateAnswerInput,
  CUDMultiAnswerInput,
  UpdateAnswerInput,
  Answer,
  AnswerListReponse,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();

@Resolver(() => Answer)
@UseGuards(AdminJwtAuthGuard)
export class AnswerResolver extends BaseResolver<
  CreateAnswerInput,
  UpdateAnswerInput,
  AnswerQueryInput
>({
  viewDto: Answer,
  createInput: CreateAnswerInput,
  updateInput: UpdateAnswerInput,
  listQueryInput: AnswerQueryInput,
  listViewDto: AnswerListReponse,
  name: 'answer',
  pluralName: 'answers',
}) {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, AnswerMessagePattern);
  }

  @ResolveField()
  async question(@Parent() answer: Answer, @Context() { loaders }) {
    return await loaders.question.load(answer.questionId);
  }

  @Mutation(() => Answer, { name: 'createAnswer' })
  async create(@Args('input') input: CreateAnswerInput, @CurrentUser() user) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(AnswerMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => AnswerListReponse, { name: 'CUDMultiAnswer' })
  async CUDMultiAnswer(
    @Args('input') input: CUDMultiAnswerInput,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(AnswerMessagePattern.BATCH_CUD, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => Answer, { name: 'updateAnswer' })
  async update(
    @Args('input') input: UpdateAnswerInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(AnswerMessagePattern.UPDATE, {
        input: dataOrg,
        user,
        id,
      }),
    );
  }

  @Query(() => AnswerListReponse, { name: 'answers' })
  async findAll(
    @Args('query', {
      type: () => AnswerQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: AnswerQueryInput,
    @Info() info,
    @CurrentUser() user,
  ) {
    const select =
      info.fieldNodes[0].selectionSet.selections[0].selectionSet.selections.map(
        (item) => item.name.value,
      );
    const { condition, pagination } = query as any;
    const dataOrg = user.orgId
      ? { ...condition, orgId: user.orgId }
      : condition;
    return await firstValueFrom(
      this.quizzMicroservice.send(AnswerMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
}
