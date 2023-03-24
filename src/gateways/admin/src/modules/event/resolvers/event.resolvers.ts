import {
  CurrentUser,
  EventMessagePattern,
  EventMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  EventQueryInput,
  CreateEventInput,
  UpdateEventInput,
  Event,
  EventListReponse,
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

const eventMicroserviceConfig = new EventMicroserviceConfig();
@Resolver(() => Event)
@UseGuards(AdminJwtAuthGuard)
export class EventResolver extends BaseResolver<
  CreateEventInput,
  UpdateEventInput,
  EventQueryInput
>({
  viewDto: Event,
  createInput: CreateEventInput,
  updateInput: UpdateEventInput,
  listQueryInput: EventQueryInput,
  listViewDto: EventListReponse,
  name: 'event',
  pluralName: 'events',
}) {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, EventMessagePattern);
  }

  @ResolveField()
  async quizzes(@Parent() event: Event, @Context() { loaders }) {
    return await loaders.quizz.loadMany(event.quizzes);
  }
  @ResolveField()
  async labels(@Parent() event: Event, @Context() { loaders }) {
    return await loaders.eventLabel.loadMany(event.labels);
  }
  @ResolveField()
  async categories(@Parent() event: Event, @Context() { loaders }) {
    return await loaders.category.loadMany(event.categories);
  }

  @ResolveField()
  async tags(@Parent() event: Event, @Context() { loaders }) {
    return await loaders.tagCourse.loadMany(event.tags);
  }
  @ResolveField()
  async tagQuizzes(@Parent() event: Event, @Context() { loaders }) {
    return await loaders.tagCourse.loadMany(event.tagQuizzes);
  }
  @ResolveField()
  async createdBy(@Parent() event: Event, @Context() { loaders }) {
    return await loaders.administrator.load(event.createdBy);
  }
  @ResolveField()
  async orgId(@Parent() event: Event, @Context() { loaders }) {
    return await loaders.organization.load(event.orgId);
  }

  @Mutation(() => Event, { name: 'createEvent' })
  async create(
    @Args('input')
    input: CreateEventInput,
    @CurrentUser() user,
  ) {
    const dataOrg = { ...input, orgId: user.orgId };
    return await firstValueFrom(
      this.eventMicroservice.send(EventMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => Event, { name: 'updateEvent' })
  async update(
    @Args('input')
    input: UpdateEventInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.eventMicroservice.send(EventMessagePattern.UPDATE, {
        input: dataOrg,
        user,
        id,
      }),
    );
  }
  @Query(() => EventListReponse, { name: 'events' })
  async findAll(
    @Args('query', {
      type: () => EventQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: EventQueryInput,
    @Info() info,
    @CurrentUser() user,
  ) {
    const select =
      info.fieldNodes[0].selectionSet.selections[0].selectionSet.selections.map(
        (item) => item.name.value,
      );
    const { condition, pagination } = query as any;
    const dataOrg = user.orgId
      ? { ...condition, orgId: user.orgId }
      : condition;
    return await firstValueFrom(
      this.eventMicroservice.send(EventMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
}
