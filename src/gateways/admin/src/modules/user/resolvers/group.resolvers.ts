import { GroupMessagePattern, UserMicroserviceConfig } from '@metahop/core';
import {
  BaseResolver,
  GroupQueryInput,
  CreateGroupInput,
  UpdateGroupInput,
  Group,
  GroupListReponse,
} from '@metahop/graphql';
import { Resolver } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const userMicroserviceConfig = new UserMicroserviceConfig();

@Resolver(() => Group)
export class GroupResolver extends BaseResolver<
  CreateGroupInput,
  UpdateGroupInput,
  GroupQueryInput
>({
  viewDto: Group,
  createInput: CreateGroupInput,
  updateInput: UpdateGroupInput,
  listQueryInput: GroupQueryInput,
  listViewDto: GroupListReponse,
  name: 'group',
  pluralName: 'groups',
}) {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly groupMicroservice: ClientProxy,
  ) {
    super(groupMicroservice, GroupMessagePattern);
  }
}
