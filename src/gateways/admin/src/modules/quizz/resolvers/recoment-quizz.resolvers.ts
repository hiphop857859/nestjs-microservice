import {
  RecomentQuizzMessagePattern,
  CurrentUser,
  AdminJwtAuthGuard,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  RecomentQuizzQueryInput,
  CreateRecomentQuizzInput,
  UpdateRecomentQuizzInput,
  RecomentQuizz,
  RecomentQuizzListReponse,
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
@Resolver(() => RecomentQuizz)
@UseGuards(AdminJwtAuthGuard)
export class RecomentQuizzResolver extends BaseResolver<
  CreateRecomentQuizzInput,
  UpdateRecomentQuizzInput,
  RecomentQuizzQueryInput
>({
  viewDto: RecomentQuizz,
  createInput: CreateRecomentQuizzInput,
  updateInput: UpdateRecomentQuizzInput,
  listQueryInput: RecomentQuizzQueryInput,
  listViewDto: RecomentQuizzListReponse,
  name: 'recomentQuizz',
  pluralName: 'recommendedQuizzes',
}) {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, RecomentQuizzMessagePattern);
  }

  @ResolveField()
  async quizzes(
    @Parent() recomentQuizz: RecomentQuizz,
    @Context() { loaders },
  ) {
    return await loaders.quizzList.loadMany(recomentQuizz.quizzes);
  }

  @Mutation(() => RecomentQuizz, { name: 'createRecomentQuizz' })
  async create(
    @Args('input')
    input: CreateRecomentQuizzInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.quizzMicroservice.send(RecomentQuizzMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => RecomentQuizz, { name: 'updateRecomentQuizz' })
  async update(
    @Args('input') input: UpdateRecomentQuizzInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.quizzMicroservice.send(RecomentQuizzMessagePattern.UPDATE, {
        input,
        id,
        user,
      }),
    );
  }
}
