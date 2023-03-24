import {
  BaseDataLoader,
  QuizzMessagePattern,
  QuestionMessagePattern,
  EventMessagePattern,
  QuizzMicroserviceConfig,
  EventMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as DataLoader from 'dataloader';
import { firstValueFrom } from 'rxjs';
const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
const eventMicroserviceConfig = new EventMicroserviceConfig();
export class QuizzDataloader extends BaseDataLoader {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, QuizzMessagePattern);
  }

  count(): DataLoader<string, any> {
    return new DataLoader<string, any>(async (input) => {
      const arr = [];
     
      return arr;
    });
  }
}
