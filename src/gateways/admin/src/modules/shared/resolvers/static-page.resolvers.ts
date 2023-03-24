import {
  StaticPageMessagePattern,
  SharedMicroserviceConfig,
  CurrentUser,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  StaticPageQueryInput,
  CreateStaticPageInput,
  UpdateStaticPageInput,
  StaticPage,
  StaticPageListReponse,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const sharedMicroserviceConfig = new SharedMicroserviceConfig();

@UseGuards(AdminJwtAuthGuard)
@Resolver(() => StaticPage)
export class StaticPageResolver extends BaseResolver<
  CreateStaticPageInput,
  UpdateStaticPageInput,
  StaticPageQueryInput
>({
  viewDto: StaticPage,
  createInput: CreateStaticPageInput,
  updateInput: UpdateStaticPageInput,
  listQueryInput: StaticPageQueryInput,
  listViewDto: StaticPageListReponse,
  name: 'staticPage',
  pluralName: 'staticPages',
}) {
  constructor(
    @Inject(sharedMicroserviceConfig.name)
    private readonly sharedMicroservice: ClientProxy,
  ) {
    super(sharedMicroservice, StaticPageMessagePattern);
  }
  @ResolveField()
  async orgId(@Parent() setting: StaticPage, @Context() { loaders }) {
    return await loaders.organization.load(setting.orgId);
  }
  @Mutation(() => StaticPage, { name: 'createStaticPage' })
  async create(
    @Args('input') input: CreateStaticPageInput,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.sharedMicroservice.send(StaticPageMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => StaticPage, { name: 'updateStaticPage' })
  async update(
    @Args('input') input: UpdateStaticPageInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.sharedMicroservice.send(StaticPageMessagePattern.UPDATE, {
        input: dataOrg,
        id,
        user,
      }),
    );
  }
  @Query(() => StaticPageListReponse, { name: 'staticPages' })
  async findAll(
    @Args('query', {
      type: () => StaticPageQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: StaticPageQueryInput,
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
      this.sharedMicroservice.send(StaticPageMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
}
