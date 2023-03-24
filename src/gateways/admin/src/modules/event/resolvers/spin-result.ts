import {
  CurrentUser,
  SpinResultMessagePattern,
  EventMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  SpinResultQueryInput,
  CreateSpinResultInput,
  UpdateSpinResultInput,
  SpinResult,
  SpinResultListReponse,
  GiftStatistic,
} from '@metahop/graphql';

import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { GiftStatisticInput } from '../input/giftStatistic';

const eventMicroserviceConfig = new EventMicroserviceConfig();
@Resolver(() => SpinResult)
@UseGuards(AdminJwtAuthGuard)
export class SpinResultResolver extends BaseResolver<
  CreateSpinResultInput,
  UpdateSpinResultInput,
  SpinResultQueryInput
>({
  viewDto: SpinResult,
  createInput: CreateSpinResultInput,
  updateInput: UpdateSpinResultInput,
  listQueryInput: SpinResultQueryInput,
  listViewDto: SpinResultListReponse,
  name: 'spinResult',
  pluralName: 'spinResults',
}) {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, SpinResultMessagePattern);
  }

  @Query(() => GiftStatistic, { name: 'giftStatistic' })
  async findAll(
    @Args('query', {
      type: () => GiftStatisticInput,
      nullable: true,
      defaultValue: {},
    })
    query: GiftStatisticInput,
  ) {
    const { sessionSpinId } = query as any;
    return await firstValueFrom(
      this.eventMicroservice.send(SpinResultMessagePattern.STATISTIC, {
        sessionSpinId,
      }),
    );
  }
}
