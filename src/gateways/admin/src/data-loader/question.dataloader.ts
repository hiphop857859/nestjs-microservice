import {
  BaseDataLoader,
  QuestionMessagePattern,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
export class QuestionDataloader extends BaseDataLoader {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, QuestionMessagePattern);
  }
}
