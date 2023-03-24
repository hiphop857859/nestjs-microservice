import {
  CurrentUser,
  EventLabelMessagePattern,
  EventMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  EventLabelQueryInput,
  CreateEventLabelInput,
  UpdateEventLabelInput,
  EventLabel,
  EventLabelListReponse,
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
@Resolver(() => EventLabel)
@UseGuards(AdminJwtAuthGuard)
export class EventLabelResolver extends BaseResolver<
  CreateEventLabelInput,
  UpdateEventLabelInput,
  EventLabelQueryInput
>({
  viewDto: EventLabel,
  createInput: CreateEventLabelInput,
  updateInput: UpdateEventLabelInput,
  listQueryInput: EventLabelQueryInput,
  listViewDto: EventLabelListReponse,
  name: 'eventLabel',
  pluralName: 'eventLabels',
}) {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, EventLabelMessagePattern);
  }

  @Mutation(() => EventLabel, { name: 'createEventLabel' })
  async create(
    @Args('input')
    input: CreateEventLabelInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(EventLabelMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => EventLabel, { name: 'updateEventLabel' })
  async update(
    @Args('input')
    input: UpdateEventLabelInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(EventLabelMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
