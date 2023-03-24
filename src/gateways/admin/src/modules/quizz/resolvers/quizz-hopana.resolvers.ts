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
  CreateQuizzHopanaInput,
  UpdateQuizzHopanaInput,
} from '../input/quizz.input';
import { QuizzHopana } from '../typedefs/quizz.typedef';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
@Resolver(() => QuizzHopana)
@UseGuards(AdminJwtAuthGuard)
export class QuizzHopanaResolver extends BaseResolver<
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
  async categories(@Parent() quizz: QuizzHopana, @Context() { loaders }) {
    return await loaders.category.loadMany(quizz.categories);
  }
  @ResolveField()
  async tags(@Parent() quizz: QuizzHopana, @Context() { loaders }) {
    return await loaders.tagCourse.loadMany(quizz.tags);
  }
 
  @Mutation(() => QuizzHopana, { name: 'createQuizzHopana' })
  async createQuizzHopana(
    @Args('input') input: CreateQuizzHopanaInput,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(QuizzMessagePattern.CREATE_PORTAL, {
        input: dataOrg,
        user,
      }),
    );
  }
  @Mutation(() => QuizzHopana, { name: 'updateQuizzHopana' })
  async updateQuizzHopana(
    @Args('input') input: UpdateQuizzHopanaInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(QuizzMessagePattern.UPDATE_PORTAL, {
        input: dataOrg,
        id,
        user,
      }),
    );
  }
  @Query(() => QuizzHopana, { name: 'quizzHopana' })
  async quizzHopana(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
    @Info() info,
  ) {
    const select = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );
    return await firstValueFrom(
      this.quizzMicroservice.send(this.message.GET, { id, select }),
    );
  }
}
