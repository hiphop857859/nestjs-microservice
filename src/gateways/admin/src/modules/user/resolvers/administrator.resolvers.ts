import {
  AdministratorMessagePattern,
  UserMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  AdministratorQueryInput,
  CreateAdministratorInput,
  UpdateAdministratorInput,
  Administrator,
  AdministratorListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const userMicroserviceConfig = new UserMicroserviceConfig();

@Resolver(() => Administrator)
export class AdministratorResolver extends BaseResolver<
  CreateAdministratorInput,
  UpdateAdministratorInput,
  AdministratorQueryInput
>({
  viewDto: Administrator,
  createInput: CreateAdministratorInput,
  updateInput: UpdateAdministratorInput,
  listQueryInput: AdministratorQueryInput,
  listViewDto: AdministratorListReponse,
  name: 'administrator',
  pluralName: 'administrators',
}) {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly administratorMicroservice: ClientProxy,
  ) {
    super(administratorMicroservice, AdministratorMessagePattern);
  }
}
