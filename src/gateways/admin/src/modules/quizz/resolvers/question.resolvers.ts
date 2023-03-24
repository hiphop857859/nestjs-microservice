import {
  CurrentUser,
  AdminJwtAuthGuard,
  QuestionMessagePattern,
  QuizzMicroserviceConfig,
  QuizzMessagePattern,
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
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ImportQuestionCsvInput } from '../inputs/question.input';
import {
  ImportQuestionCsv,
  UpdateAllTotalCategoryQuestion,
} from './../typedefs/question.typedef';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
@Resolver(() => Question)
@UseGuards(AdminJwtAuthGuard)
export class QuestionResolver extends BaseResolver<
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
  @Mutation(() => Question, { name: 'createQuestion' })
  async create(
    @Args('input')
    input: CreateQuestionInput,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(QuestionMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => Question, { name: 'updateQuestion' })
  async update(
    @Args('input') input: UpdateQuestionInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(QuestionMessagePattern.UPDATE, {
        input: dataOrg,
        user,
        id,
      }),
    );
  }

  @Query(() => QuestionListReponse, { name: 'questions' })
  async findAll(
    @Args('query', {
      type: () => QuestionQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: QuestionQueryInput,
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
      this.quizzMicroservice.send(QuestionMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
  @Mutation(() => ImportQuestionCsv, {
    name: 'importQuizzStep1ImportQuestion',
  })
  async importQuestionCsv(
    @Args('input')
    input: ImportQuestionCsvInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.quizzMicroservice.send(QuestionMessagePattern.IMPORT_CSV, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => UpdateAllTotalCategoryQuestion, {
    name: 'importQuizzStep2UpdateTotalCategoryQuestion',
  })
  async updateAllTotalCategoryQuestion() {
    return await firstValueFrom(
      this.quizzMicroservice.send(
        QuestionMessagePattern.UPDATE_ALL_TOTAL_CATEGORY,
        {},
      ),
    );
  }
}
