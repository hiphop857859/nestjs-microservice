import {
  BaseDataLoader,
  CategoryMessagePattern,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
export class CategoryDataloader extends BaseDataLoader {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, CategoryMessagePattern);
  }
}
