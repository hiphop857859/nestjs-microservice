import {
  CurrentUser,
  EventHistoryMessagePattern,
  EventMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  EventHistoryQueryInput,
  CreateEventHistoryInput,
  UpdateEventHistoryInput,
  EventHistory,
  EventHistoryListReponse,
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
@Resolver(() => EventHistory)
@UseGuards(AdminJwtAuthGuard)
export class EventHistoryResolver extends BaseResolver<
  CreateEventHistoryInput,
  UpdateEventHistoryInput,
  EventHistoryQueryInput
>({
  viewDto: EventHistory,
  createInput: CreateEventHistoryInput,
  updateInput: UpdateEventHistoryInput,
  listQueryInput: EventHistoryQueryInput,
  listViewDto: EventHistoryListReponse,
  name: 'eventHistory',
  pluralName: 'eventHistorys',
}) {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, EventHistoryMessagePattern);
  }

  @Mutation(() => EventHistory, { name: 'createEventHistory' })
  async create(
    @Args('input')
    input: CreateEventHistoryInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(EventHistoryMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => EventHistory, { name: 'updateEventHistory' })
  async update(
    @Args('input')
    input: UpdateEventHistoryInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(EventHistoryMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
