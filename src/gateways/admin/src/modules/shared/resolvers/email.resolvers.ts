import { EmailMessagePattern, SharedMicroserviceConfig } from '@metahop/core';
import {
  BaseResolver,
  EmailQueryInput,
  CreateEmailInput,
  UpdateEmailInput,
  Email,
  EmailListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const sharedMicroserviceConfig = new SharedMicroserviceConfig();

@Resolver(() => Email)
export class EmailResolver extends BaseResolver<
  CreateEmailInput,
  UpdateEmailInput,
  EmailQueryInput
>({
  viewDto: Email,
  createInput: CreateEmailInput,
  updateInput: UpdateEmailInput,
  listQueryInput: EmailQueryInput,
  listViewDto: EmailListReponse,
  name: 'email',
  pluralName: 'emails',
}) {
  constructor(
    @Inject(sharedMicroserviceConfig.name)
    private readonly sharedMicroservice: ClientProxy,
  ) {
    super(sharedMicroservice, EmailMessagePattern);
  }
}
