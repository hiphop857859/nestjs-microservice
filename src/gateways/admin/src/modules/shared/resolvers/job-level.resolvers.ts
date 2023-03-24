import {
  JobLevelMessagePattern,
  SharedMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  JobLevelQueryInput,
  CreateJobLevelInput,
  UpdateJobLevelInput,
  JobLevel,
  JobLevelListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const sharedMicroserviceConfig = new SharedMicroserviceConfig();

@Resolver(() => JobLevel)
export class JobLevelResolver extends BaseResolver<
  CreateJobLevelInput,
  UpdateJobLevelInput,
  JobLevelQueryInput
>({
  viewDto: JobLevel,
  createInput: CreateJobLevelInput,
  updateInput: UpdateJobLevelInput,
  listQueryInput: JobLevelQueryInput,
  listViewDto: JobLevelListReponse,
  name: 'jobLevel',
  pluralName: 'jobLevels',
}) {
  constructor(
    @Inject(sharedMicroserviceConfig.name)
    private readonly sharedMicroservice: ClientProxy,
  ) {
    super(sharedMicroservice, JobLevelMessagePattern);
  }
}
