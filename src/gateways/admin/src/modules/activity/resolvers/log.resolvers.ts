import {
  CurrentUser,
  LogMessagePattern,
  ActivityMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  LogQueryInput,
  CreateLogInput,
  UpdateLogInput,
  Log,
  LogListReponse,
  FunctionName,
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

const activityMicroserviceConfig = new ActivityMicroserviceConfig();
@Resolver(() => Log)
@UseGuards(AdminJwtAuthGuard)
export class LogResolver extends BaseResolver<
  CreateLogInput,
  UpdateLogInput,
  LogQueryInput
>({
  viewDto: Log,
  createInput: CreateLogInput,
  updateInput: UpdateLogInput,
  listQueryInput: LogQueryInput,
  listViewDto: LogListReponse,
  name: 'log',
  pluralName: 'logs',
  excludeFunctions: [
    FunctionName.CREATE,
    FunctionName.DELETE,
    FunctionName.UPDATE,
  ],
}) {
  constructor(
    @Inject(activityMicroserviceConfig.name)
    private readonly activityMicroservice: ClientProxy,
  ) {
    super(activityMicroservice, LogMessagePattern);
  }

  @ResolveField()
  async createdBy(@Parent() log: Log, @Context() { loaders }) {
    return await loaders.administrator.load(log.createdBy);
  }
}
