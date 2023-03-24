import {
  CurrentUser,
  RequirePermissions,
  EventAttendeeMessagePattern,
  EventMicroserviceConfig,
  AdminJwtAuthGuard,
  PREFIX_COMPONENT,
  ACTIONS_ROLE,
} from '@metahop/core';
import {
  BaseResolver,
  EventAttendeeQueryInput,
  CreateEventAttendeeInput,
  UpdateEventAttendeeInput,
  EventAttendee,
  EventAttendeeListReponse,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  StatisticsEarnResponse,
  StatisticsPlaytimeResponse,
} from '../typedef/event-attendee.typedef';
import {
  statisticsEarnInput,
  statisticsPlaytimeInput,
} from '../input/event-attendee.input';

const eventMicroserviceConfig = new EventMicroserviceConfig();
@Resolver(() => EventAttendee)
@UseGuards(AdminJwtAuthGuard)
export class EventAttendeeResolver extends BaseResolver<
  CreateEventAttendeeInput,
  UpdateEventAttendeeInput,
  EventAttendeeQueryInput
>({
  viewDto: EventAttendee,
  createInput: CreateEventAttendeeInput,
  updateInput: UpdateEventAttendeeInput,
  listQueryInput: EventAttendeeQueryInput,
  listViewDto: EventAttendeeListReponse,
  name: 'eventAttendee',
  pluralName: 'eventAttendees',
}) {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, EventAttendeeMessagePattern);
  }
  @RequirePermissions([`${PREFIX_COMPONENT.EVENT}${ACTIONS_ROLE.ADD}`])
  @Mutation(() => EventAttendee, { name: 'createEventAttendee' })
  async create(
    @Args('input')
    input: CreateEventAttendeeInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(EventAttendeeMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }
  @RequirePermissions([`${PREFIX_COMPONENT.EVENT}${ACTIONS_ROLE.EDIT}`])
  @Mutation(() => EventAttendee, { name: 'updateEventAttendee' })
  async update(
    @Args('input')
    input: UpdateEventAttendeeInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(EventAttendeeMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }

  @Query(() => StatisticsEarnResponse, {
    name: 'statisticsEarn',
    nullable: true,
  })
  async statisticsEarn(
    @Args('input')
    input: statisticsEarnInput,
  ) {
    return await firstValueFrom(
      this.baseMicroservice.send(EventAttendeeMessagePattern.STATISTICS_EARN, {
        ...input,
        user: input.userId,
      }),
    );
  }

  @Query(() => StatisticsPlaytimeResponse, {
    name: 'statisticsPlaytime',
    nullable: true,
  })
  async statisticsPlaytime(
    @Args('input')
    input: statisticsPlaytimeInput,
  ) {
    return await firstValueFrom(
      this.baseMicroservice.send(
        EventAttendeeMessagePattern.STATISTICS_PLAYTIME,
        {
          ...input,
          user: input.userId,
        },
      ),
    );
  }
}
