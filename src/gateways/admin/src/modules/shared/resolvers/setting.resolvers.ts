import {
  AdminJwtAuthGuard,
  CurrentUser,
  SettingMessagePattern,
  SharedMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  SettingQueryInput,
  CreateSettingInput,
  UpdateSettingInput,
  Setting,
  SettingListReponse,
} from '@metahop/graphql';
import { Args, Context, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const sharedMicroserviceConfig = new SharedMicroserviceConfig();
@UseGuards(AdminJwtAuthGuard)
@Resolver(() => Setting)
export class SettingResolver extends BaseResolver<
  CreateSettingInput,
  UpdateSettingInput,
  SettingQueryInput
>({
  viewDto: Setting,
  createInput: CreateSettingInput,
  updateInput: UpdateSettingInput,
  listQueryInput: SettingQueryInput,
  listViewDto: SettingListReponse,
  name: 'setting',
  pluralName: 'settings',
}) {
  constructor(
    @Inject(sharedMicroserviceConfig.name)
    private readonly sharedMicroservice: ClientProxy,
  ) {
    super(sharedMicroservice, SettingMessagePattern);
  }
  @ResolveField()
  async orgId(@Parent() setting: Setting, @Context() { loaders }) {
    try {
      return await loaders.organization.load(setting.orgId);
    } catch (error) {
      return "";
    }


  }

  @Mutation(() => Setting, { name: 'createSetting' })
  async create(@Args('input') input: CreateSettingInput, @CurrentUser() user) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.sharedMicroservice.send(SettingMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => Setting, { name: 'updateSetting' })
  async update(
    @Args('input') input: UpdateSettingInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.sharedMicroservice.send(SettingMessagePattern.UPDATE, {
        input: dataOrg,
        id,
        user,
      }),
    );
  }
  @Query(() => SettingListReponse, { name: 'settings' })
  async findAll(
    @Args('query', {
      type: () => SettingQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: SettingQueryInput,
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
      this.sharedMicroservice.send(SettingMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
        user
      }),
    );
  }
}
