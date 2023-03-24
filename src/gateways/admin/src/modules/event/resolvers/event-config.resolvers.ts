import {
  CurrentUser,
  EventConfigMessagePattern,
  EventMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  EventConfigQueryInput,
  CreateEventConfigInput,
  UpdateEventConfigInput,
  EventConfig,
  EventConfigListReponse,
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
@Resolver(() => EventConfig)
@UseGuards(AdminJwtAuthGuard)
export class EventConfigResolver extends BaseResolver<
  CreateEventConfigInput,
  UpdateEventConfigInput,
  EventConfigQueryInput
>({
  viewDto: EventConfig,
  createInput: CreateEventConfigInput,
  updateInput: UpdateEventConfigInput,
  listQueryInput: EventConfigQueryInput,
  listViewDto: EventConfigListReponse,
  name: 'eventConfig',
  pluralName: 'eventConfigs',
}) {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, EventConfigMessagePattern);
  }

  @Mutation(() => EventConfig, { name: 'createEventConfig' })
  async create(
    @Args('input')
    input: CreateEventConfigInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(EventConfigMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => EventConfig, { name: 'updateEventConfig' })
  async update(
    @Args('input')
    input: UpdateEventConfigInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(EventConfigMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
