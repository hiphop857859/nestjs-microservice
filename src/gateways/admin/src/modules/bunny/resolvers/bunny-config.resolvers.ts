import {
  BunnyConfigMessagePattern,
  BunnyMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  BunnyConfigQueryInput,
  CreateBunnyConfigInput,
  UpdateBunnyConfigInput,
  BunnyConfig,
  BunnyConfigListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const bunnyMicroserviceConfig = new BunnyMicroserviceConfig();

@Resolver(() => BunnyConfig)
export class BunnyConfigResolver extends BaseResolver<
  CreateBunnyConfigInput,
  UpdateBunnyConfigInput,
  BunnyConfigQueryInput
>({
  viewDto: BunnyConfig,
  createInput: CreateBunnyConfigInput,
  updateInput: UpdateBunnyConfigInput,
  listQueryInput: BunnyConfigQueryInput,
  listViewDto: BunnyConfigListReponse,
  name: 'bunnyConfig',
  pluralName: 'bunnyConfigs',
}) {
  constructor(
    @Inject(bunnyMicroserviceConfig.name)
    private readonly bunnyMicroservice: ClientProxy,
  ) {
    super(bunnyMicroservice, BunnyConfigMessagePattern);
  }
}
