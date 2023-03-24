import { BunnyMessagePattern, BunnyMicroserviceConfig } from '@metahop/core';
import {
  BaseResolver,
  BunnyQueryInput,
  CreateBunnyInput,
  UpdateBunnyInput,
  Bunny,
  BunnyListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const bunnyMicroserviceConfig = new BunnyMicroserviceConfig();
@Resolver(() => Bunny)
export class BunnyResolver extends BaseResolver<
  CreateBunnyInput,
  UpdateBunnyInput,
  BunnyQueryInput
>({
  viewDto: Bunny,
  createInput: CreateBunnyInput,
  updateInput: UpdateBunnyInput,
  listQueryInput: BunnyQueryInput,
  listViewDto: BunnyListReponse,
  name: 'bunny',
  pluralName: 'bunnies',
}) {
  constructor(
    @Inject(bunnyMicroserviceConfig.name)
    private readonly bunnyMicroservice: ClientProxy,
  ) {
    super(bunnyMicroservice, BunnyMessagePattern);
  }
}
