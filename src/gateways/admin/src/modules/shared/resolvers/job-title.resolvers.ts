import {
  JobTitleMessagePattern,
  SharedMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  JobTitleQueryInput,
  CreateJobTitleInput,
  UpdateJobTitleInput,
  JobTitle,
  JobTitleListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const sharedMicroserviceConfig = new SharedMicroserviceConfig();

@Resolver(() => JobTitle)
export class JobTitleResolver extends BaseResolver<
  CreateJobTitleInput,
  UpdateJobTitleInput,
  JobTitleQueryInput
>({
  viewDto: JobTitle,
  createInput: CreateJobTitleInput,
  updateInput: UpdateJobTitleInput,
  listQueryInput: JobTitleQueryInput,
  listViewDto: JobTitleListReponse,
  name: 'jobTitle',
  pluralName: 'jobTitles',
}) {
  constructor(
    @Inject(sharedMicroserviceConfig.name)
    private readonly sharedMicroservice: ClientProxy,
  ) {
    super(sharedMicroservice, JobTitleMessagePattern);
  }
}
