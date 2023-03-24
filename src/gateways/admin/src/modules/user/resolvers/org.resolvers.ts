import {
  AdminJwtAuthGuard,
  CurrentUser,
  OrgMessagePattern,
  UserMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  OrgQueryInput,
  CreateOrgInput,
  UpdateOrgInput,
  Org,
  OrgListReponse,
} from '@metahop/graphql';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const userMicroserviceConfig = new UserMicroserviceConfig();

@Resolver(() => Org)
@UseGuards(AdminJwtAuthGuard)
export class OrgResolver extends BaseResolver<
  CreateOrgInput,
  UpdateOrgInput,
  OrgQueryInput
>({
  viewDto: Org,
  createInput: CreateOrgInput,
  updateInput: UpdateOrgInput,
  listQueryInput: OrgQueryInput,
  listViewDto: OrgListReponse,
  name: 'org',
  pluralName: 'orgs',
}) {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly userMicroservice: ClientProxy,
  ) {
    super(userMicroservice, OrgMessagePattern);
  }

  @Mutation(() => Org, { name: 'createOrg' })
  async create(
    @Args('input')
    input: CreateOrgInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.userMicroservice.send(OrgMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => Org, { name: 'updateOrg' })
  async update(
    @Args('input')
    input: UpdateOrgInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.userMicroservice.send(OrgMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
