import {
  CurrentUser,
  AdminJwtAuthGuard,
  CategoryMessagePattern,
  QuizzMicroserviceConfig,
} from '@metahop/core';
import {
  BaseResolver,
  CategoryQueryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  Category,
  CategoryListReponse,
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

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
@Resolver(() => Category)
@UseGuards(AdminJwtAuthGuard)
export class CategoryResolver extends BaseResolver<
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoryQueryInput
>({
  viewDto: Category,
  createInput: CreateCategoryInput,
  updateInput: UpdateCategoryInput,
  listQueryInput: CategoryQueryInput,
  listViewDto: CategoryListReponse,
  name: 'category',
  pluralName: 'categories',
}) {
  constructor(
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(quizzMicroservice, CategoryMessagePattern);
  }
  @ResolveField()
  async createdBy(@Parent() category: Category, @Context() { loaders }) {
    return await loaders.administrator.load(category.createdBy);
  }
  @ResolveField()
  async orgId(@Parent() category: Category, @Context() { loaders }) {
    return await loaders.organization.load(category.orgId);
  }

  @Mutation(() => Category, { name: 'createCategory' })
  async create(@Args('input') input: CreateCategoryInput, @CurrentUser() user) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(CategoryMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => Category, { name: 'updateCategory' })
  async update(
    @Args('input') input: UpdateCategoryInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.quizzMicroservice.send(CategoryMessagePattern.UPDATE, {
        input: dataOrg,
        user,
        id,
      }),
    );
  }

  @Query(() => CategoryListReponse, { name: 'categories' })
  async findAll(
    @Args('query', {
      type: () => CategoryQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: CategoryQueryInput,
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
      this.quizzMicroservice.send(CategoryMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
}
