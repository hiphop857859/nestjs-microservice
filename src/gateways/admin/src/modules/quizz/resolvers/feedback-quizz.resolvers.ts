import {
  FeedbackQuizzMessagePattern,
  AdminJwtAuthGuard,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  FeedbackQuizzQueryInput,
  CreateFeedbackQuizzInput,
  UpdateFeedbackQuizzInput,
  FeedbackQuizz,
  FeedbackQuizzListReponse,
} from '@metahop/graphql';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();

@Resolver(() => FeedbackQuizz)
@UseGuards(AdminJwtAuthGuard)
export class FeedbackQuizzResolver extends BaseResolver<
  CreateFeedbackQuizzInput,
  UpdateFeedbackQuizzInput,
  FeedbackQuizzQueryInput
>({
  viewDto: FeedbackQuizz,
  createInput: CreateFeedbackQuizzInput,
  updateInput: UpdateFeedbackQuizzInput,
  listQueryInput: FeedbackQuizzQueryInput,
  listViewDto: FeedbackQuizzListReponse,
  name: 'feedbackQuizz',
  pluralName: 'feedbackQuizzes',
}) {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, FeedbackQuizzMessagePattern);
  }

  @ResolveField()
  async quizz(@Parent() feedbackQuizz: FeedbackQuizz, @Context() { loaders }) {
    if (feedbackQuizz.quizzId) {
      return await loaders.quizz.load(feedbackQuizz.quizzId);
    }
    return {};
  }
}
