import {
  CurrentUser,
  GiftMessagePattern,
  EventMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  GiftQueryInput,
  CreateGiftInput,
  UpdateGiftInput,
  Gift,
  GiftListReponse,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const eventMicroserviceConfig = new EventMicroserviceConfig();
@Resolver(() => Gift)
@UseGuards(AdminJwtAuthGuard)
export class GiftResolver extends BaseResolver<
  CreateGiftInput,
  UpdateGiftInput,
  GiftQueryInput
>({
  viewDto: Gift,
  createInput: CreateGiftInput,
  updateInput: UpdateGiftInput,
  listQueryInput: GiftQueryInput,
  listViewDto: GiftListReponse,
  name: 'gift',
  pluralName: 'gifts',
}) {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, GiftMessagePattern);
  }
}
