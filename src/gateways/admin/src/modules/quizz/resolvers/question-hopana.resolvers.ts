import {
  CurrentUser,
  AdminJwtAuthGuard,
  QuestionMessagePattern,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  QuestionQueryInput,
  CreateQuestionInput,
  UpdateQuestionInput,
  Question,
  QuestionListReponse,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Info,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { DataQuestionTypedefs } from '../typedefs/quizz.typedef';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
@Resolver(() => Question)
@UseGuards(AdminJwtAuthGuard)
export class QuestionHopanaResolver extends BaseResolver<
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionQueryInput
>({
  viewDto: Question,
  createInput: CreateQuestionInput,
  updateInput: UpdateQuestionInput,
  listQueryInput: QuestionQueryInput,
  listViewDto: QuestionListReponse,
  name: 'question',
  pluralName: 'questions',
}) {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, QuestionMessagePattern);
  }
  @ResolveField()
  async category(@Parent() question: Question, @Context() { loaders }) {
    if (question.categoryId) {
      return await loaders.category.load(question.categoryId);
    } else {
      return null;
    }
  }
  @ResolveField()
  async orgId(@Parent() question: Question, @Context() { loaders }) {
    return await loaders.organization.load(question.orgId);
  }

  @ResolveField()
  async createdBy(@Parent() question: Question, @Context() { loaders }) {
    return await loaders.administrator.load(question.createdBy);
  }

  @Query(() => DataQuestionTypedefs, { name: 'questionHopana' })
  async questionHopana(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
    @Info() info,
  ) {
    const select = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );
    return await firstValueFrom(
      this.quizzMicroservice.send(QuestionMessagePattern.GET_PORTAL, {
        id,
        select,
      }),
    );
  }
}
