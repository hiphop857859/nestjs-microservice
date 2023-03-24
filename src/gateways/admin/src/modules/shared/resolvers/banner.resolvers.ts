import {
  BannerMessagePattern,
  SharedMicroserviceConfig,
  CurrentUser,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  BannerQueryInput,
  CreateBannerInput,
  UpdateBannerInput,
  Banner,
  BannerListReponse,
} from '@metahop/graphql';
import { Args, Context, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const sharedMicroserviceConfig = new SharedMicroserviceConfig();

@UseGuards(AdminJwtAuthGuard)
@Resolver(() => Banner)
export class BannerResolver extends BaseResolver<
  CreateBannerInput,
  UpdateBannerInput,
  BannerQueryInput
>({
  viewDto: Banner,
  createInput: CreateBannerInput,
  updateInput: UpdateBannerInput,
  listQueryInput: BannerQueryInput,
  listViewDto: BannerListReponse,
  name: 'banner',
  pluralName: 'banners',
}) {
  constructor(
    @Inject(sharedMicroserviceConfig.name)
    private readonly sharedMicroservice: ClientProxy,
  ) {
    super(sharedMicroservice, BannerMessagePattern);
  }
  @ResolveField()
  async orgId(@Parent() banner: Banner, @Context() { loaders }) {
    return await loaders.organization.load(banner.orgId);
  }

  @Mutation(() => Banner, { name: 'createBanner' })
  async create(@Args('input') input: CreateBannerInput, @CurrentUser() user) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.sharedMicroservice.send(BannerMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => Banner, { name: 'updateBanner' })
  async update(
    @Args('input') input: UpdateBannerInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.sharedMicroservice.send(BannerMessagePattern.UPDATE, {
        input: dataOrg,
        id,
        user,
      }),
    );
  }
  @Query(() => BannerListReponse, { name: 'banners' })
  async findAll(
    @Args('query', {
      type: () => BannerQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: BannerQueryInput,
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
      this.sharedMicroservice.send(BannerMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
}
