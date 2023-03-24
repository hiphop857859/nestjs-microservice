import {
  BunnyParrentMessagePattern,
  BunnyMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  BunnyParrentQueryInput,
  CreateBunnyParrentInput,
  UpdateBunnyParrentInput,
  BunnyParrent,
  BunnyParrentListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const bunnyMicroserviceConfig = new BunnyMicroserviceConfig();

@Resolver(() => BunnyParrent)
export class BunnyParrentResolver extends BaseResolver<
  CreateBunnyParrentInput,
  UpdateBunnyParrentInput,
  BunnyParrentQueryInput
>({
  viewDto: BunnyParrent,
  createInput: CreateBunnyParrentInput,
  updateInput: UpdateBunnyParrentInput,
  listQueryInput: BunnyParrentQueryInput,
  listViewDto: BunnyParrentListReponse,
  name: 'bunnyParrent',
  pluralName: 'bunnyParrents',
}) {
  constructor(
    @Inject(bunnyMicroserviceConfig.name)
    private readonly bunnyMicroservice: ClientProxy,
  ) {
    super(bunnyMicroservice, BunnyParrentMessagePattern);
  }
}
