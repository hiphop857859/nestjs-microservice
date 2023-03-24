import { RoleMessagePattern, UserMicroserviceConfig } from '@metahop/core';
import {
  BaseResolver,
  RoleQueryInput,
  CreateRoleInput,
  UpdateRoleInput,
  Role,
  RoleListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const userMicroserviceConfig = new UserMicroserviceConfig();

@Resolver(() => Role)
export class RoleResolver extends BaseResolver<
  CreateRoleInput,
  UpdateRoleInput,
  RoleQueryInput
>({
  viewDto: Role,
  createInput: CreateRoleInput,
  updateInput: UpdateRoleInput,
  listQueryInput: RoleQueryInput,
  listViewDto: RoleListReponse,
  name: 'role',
  pluralName: 'roles',
}) {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly roleMicroservice: ClientProxy,
  ) {
    super(roleMicroservice, RoleMessagePattern);
  }
}
