import {
  FeaturedQuizzMessagePattern,
  CurrentUser,
  AdminJwtAuthGuard,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  FeaturedQuizzQueryInput,
  CreateFeaturedQuizzInput,
  UpdateFeaturedQuizzInput,
  FeaturedQuizz,
  FeaturedQuizzListReponse,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
@Resolver(() => FeaturedQuizz)
@UseGuards(AdminJwtAuthGuard)
export class FeaturedQuizzResolver extends BaseResolver<
  CreateFeaturedQuizzInput,
  UpdateFeaturedQuizzInput,
  FeaturedQuizzQueryInput
>({
  viewDto: FeaturedQuizz,
  createInput: CreateFeaturedQuizzInput,
  updateInput: UpdateFeaturedQuizzInput,
  listQueryInput: FeaturedQuizzQueryInput,
  listViewDto: FeaturedQuizzListReponse,
  name: 'featuredQuizz',
  pluralName: 'featuredQuizzes',
}) {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, FeaturedQuizzMessagePattern);
  }

  @ResolveField()
  async quizz(@Parent() featuredQuizz: FeaturedQuizz, @Context() { loaders }) {
    return await loaders.quizz.load(featuredQuizz.quizzId);
  }

  @Mutation(() => FeaturedQuizz, { name: 'createFeaturedQuizz' })
  async create(
    @Args('input')
    input: CreateFeaturedQuizzInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.quizzMicroservice.send(FeaturedQuizzMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => FeaturedQuizz, { name: 'updateFeaturedQuizz' })
  async update(
    @Args('input') input: UpdateFeaturedQuizzInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.quizzMicroservice.send(FeaturedQuizzMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
