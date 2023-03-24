import {
  CurrentUser,
  AdminJwtAuthGuard,
  QuizzMessagePattern,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  QuizzQueryInput,
  CreateQuizzInput,
  UpdateQuizzInput,
  Quizz,
  QuizzListReponse,
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
import {
  GenerateQuizz,
  UpdateAllTotalCategoryQuizz,
} from '../typedefs/quizz.typedef';
import { GenerateQuizzInput } from '../inputs/quizz.input';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
@Resolver(() => Quizz)
@UseGuards(AdminJwtAuthGuard)
export class QuizzResolver extends BaseResolver<
  CreateQuizzInput,
  UpdateQuizzInput,
  QuizzQueryInput
>({
  viewDto: Quizz,
  createInput: CreateQuizzInput,
  updateInput: UpdateQuizzInput,
  listQueryInput: QuizzQueryInput,
  listViewDto: QuizzListReponse,
  name: 'quizz',
  pluralName: 'quizzes',
}) {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, QuizzMessagePattern);
  }

  @ResolveField()
  async categories(@Parent() quizz: Quizz, @Context() { loaders }) {
    return await loaders.category.loadMany(quizz.categories);
  }
  @ResolveField()
  async tags(@Parent() quizz: Quizz, @Context() { loaders }) {
    return await loaders.tagCourse.loadMany(quizz.tags);
  }

  @ResolveField()
  async orgId(@Parent() quizz: Quizz, @Context() { loaders }) {
    return await loaders.organization.load(quizz.orgId);
  }
  @Mutation(() => Quizz, { name: 'createQuizz' })
  async create(@Args('input') input: CreateQuizzInput, @CurrentUser() user) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(QuizzMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => Quizz, { name: 'updateQuizz' })
  async update(
    @Args('input') input: UpdateQuizzInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(QuizzMessagePattern.UPDATE, {
        input: dataOrg,
        id,
        user,
      }),
    );
  }

  @Query(() => QuizzListReponse, { name: 'quizzes' })
  async findAll(
    @Args('query', {
      type: () => QuizzQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: QuizzQueryInput,
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
      this.quizzMicroservice.send(QuizzMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
  @Mutation(() => GenerateQuizz, { name: 'importQuizzStep3GenerateQuizz' })
  async generateQuizz(
    @Args('input') input: GenerateQuizzInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.quizzMicroservice.send(QuizzMessagePattern.GENERATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => UpdateAllTotalCategoryQuizz, {
    name: 'importQuizzStep4UpdateTotalCategoryQuizz',
  })
  async updateAllTotalCategoryQuizz() {
    return await firstValueFrom(
      this.quizzMicroservice.send(
        QuizzMessagePattern.UPDATE_ALL_TOTAL_CATEGORY,
        {},
      ),
    );
  }
}
