import {
  CurrentUser,
  SessionSpinMessagePattern,
  EventMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  SessionSpinQueryInput,
  CreateSessionSpinInput,
  UpdateSessionSpinInput,
  SessionSpin,
  SessionSpinListReponse,
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
@Resolver(() => SessionSpin)
@UseGuards(AdminJwtAuthGuard)
export class SessionSpinResolver extends BaseResolver<
  CreateSessionSpinInput,
  UpdateSessionSpinInput,
  SessionSpinQueryInput
>({
  viewDto: SessionSpin,
  createInput: CreateSessionSpinInput,
  updateInput: UpdateSessionSpinInput,
  listQueryInput: SessionSpinQueryInput,
  listViewDto: SessionSpinListReponse,
  name: 'sessionSpin',
  pluralName: 'sessionSpins',
}) {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, SessionSpinMessagePattern);
  }
}
