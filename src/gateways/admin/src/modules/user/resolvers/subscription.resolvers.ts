import {
  AdminJwtAuthGuard,
  CurrentUser,
  SubscriptionMessagePattern,
  UserMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  SubscriptionQueryInput,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  Subscription,
  SubscriptionListReponse,
} from '@metahop/graphql';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const userMicroserviceConfig = new UserMicroserviceConfig();

@Resolver(() => Subscription)
@UseGuards(AdminJwtAuthGuard)
export class SubscriptionResolver extends BaseResolver<
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  SubscriptionQueryInput
>({
  viewDto: Subscription,
  createInput: CreateSubscriptionInput,
  updateInput: UpdateSubscriptionInput,
  listQueryInput: SubscriptionQueryInput,
  listViewDto: SubscriptionListReponse,
  name: 'Subscription',
  pluralName: 'Subscriptions',
}) {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly userMicroservice: ClientProxy,
  ) {
    super(userMicroservice, SubscriptionMessagePattern);
  }

  @Mutation(() => Subscription, { name: 'createSubscription' })
  async create(
    @Args('input')
    input: CreateSubscriptionInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.userMicroservice.send(SubscriptionMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => Subscription, { name: 'updateSubscription' })
  async update(
    @Args('input')
    input: UpdateSubscriptionInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.userMicroservice.send(SubscriptionMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
