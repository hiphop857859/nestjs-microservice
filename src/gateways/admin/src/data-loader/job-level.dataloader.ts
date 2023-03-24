import {
  BaseDataLoader,
  JobLevelMessagePattern,
  SharedMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const sharedMicroserviceConfig = new SharedMicroserviceConfig();

export class JobLevelDataloader extends BaseDataLoader {
  constructor(
    @Inject(sharedMicroserviceConfig.name)
    private readonly sharedMicroservice: ClientProxy,
  ) {
    super(sharedMicroservice, JobLevelMessagePattern);
  }
}
