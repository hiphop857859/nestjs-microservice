import {
  AdminJwtAuthGuard,
  CurrentUser,
  PlanMessagePattern,
  UserMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  PlanQueryInput,
  CreatePlanInput,
  UpdatePlanInput,
  Plan,
  PlanListReponse,
} from '@metahop/graphql';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const userMicroserviceConfig = new UserMicroserviceConfig();

@Resolver(() => Plan)
@UseGuards(AdminJwtAuthGuard)
export class PlanResolver extends BaseResolver<
  CreatePlanInput,
  UpdatePlanInput,
  PlanQueryInput
>({
  viewDto: Plan,
  createInput: CreatePlanInput,
  updateInput: UpdatePlanInput,
  listQueryInput: PlanQueryInput,
  listViewDto: PlanListReponse,
  name: 'plan',
  pluralName: 'plans',
}) {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly userMicroservice: ClientProxy,
  ) {
    super(userMicroservice, PlanMessagePattern);
  }
}
