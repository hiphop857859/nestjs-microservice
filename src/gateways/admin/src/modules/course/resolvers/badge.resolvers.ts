import {
  CurrentUser,
  BadgeMessagePattern,
  CourseMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  BadgeQueryInput,
  CreateBadgeInput,
  UpdateBadgeInput,
  Badge,
  BadgeListReponse,
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

const courseMicroserviceConfig = new CourseMicroserviceConfig();

@Resolver(() => Badge)
@UseGuards(AdminJwtAuthGuard)
export class BadgeResolver extends BaseResolver<
  CreateBadgeInput,
  UpdateBadgeInput,
  BadgeQueryInput
>({
  viewDto: Badge,
  createInput: CreateBadgeInput,
  updateInput: UpdateBadgeInput,
  listQueryInput: BadgeQueryInput,
  listViewDto: BadgeListReponse,
  name: 'badge',
  pluralName: 'badges',
}) {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, BadgeMessagePattern);
  }
  @ResolveField()
  async category(@Parent() badge: Badge, @Context() { loaders }) {
    if (badge?.categoryId) {
      return await loaders.category.load(badge.categoryId);
    } else {
      return null;
    }
  }
  @ResolveField()
  async orgId(@Parent() badge: Badge, @Context() { loaders }) {
    return await loaders.organization.load(badge.orgId);
  }

  @ResolveField()
  async createdBy(@Parent() badge: Badge, @Context() { loaders }) {
    return await loaders.administrator.load(badge.createdBy);
  }

  @Mutation(() => Badge, { name: 'createBadge' })
  async create(
    @Args('input')
    input: CreateBadgeInput,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.courseMicroservice.send(BadgeMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => Badge, { name: 'updateBadge' })
  async update(
    @Args('input') input: UpdateBadgeInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.courseMicroservice.send(BadgeMessagePattern.UPDATE, {
        input: dataOrg,
        user,
        id,
      }),
    );
  }

  @Query(() => BadgeListReponse, { name: 'badges' })
  async findAll(
    @Args('query', {
      type: () => BadgeQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: BadgeQueryInput,
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
      this.courseMicroservice.send(BadgeMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
}
