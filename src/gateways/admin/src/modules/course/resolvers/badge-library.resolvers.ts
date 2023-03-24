import {
  CurrentUser,
  BadgeLibraryMessagePattern,
  CourseMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  BadgeLibraryQueryInput,
  CreateBadgeLibraryInput,
  UpdateBadgeLibraryInput,
  BadgeLibrary,
  BadgeLibraryListReponse,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const courseMicroserviceConfig = new CourseMicroserviceConfig();

@Resolver(() => BadgeLibrary)
@UseGuards(AdminJwtAuthGuard)
export class BadgeLibraryResolver extends BaseResolver<
  CreateBadgeLibraryInput,
  UpdateBadgeLibraryInput,
  BadgeLibraryQueryInput
>({
  viewDto: BadgeLibrary,
  createInput: CreateBadgeLibraryInput,
  updateInput: UpdateBadgeLibraryInput,
  listQueryInput: BadgeLibraryQueryInput,
  listViewDto: BadgeLibraryListReponse,
  name: 'badgeLibrary',
  pluralName: 'badgeLibrarys',
}) {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, BadgeLibraryMessagePattern);
  }
  @ResolveField()
  async category(@Parent() badgeLibrary: BadgeLibrary, @Context() { loaders }) {
    if (badgeLibrary?.categoryId) {
      return await loaders.category.load(badgeLibrary.categoryId);
    } else {
      return null;
    }
  }
  @ResolveField()
  async createdBy(
    @Parent() badgeLibrary: BadgeLibrary,
    @Context() { loaders },
  ) {
    return await loaders.administrator.load(badgeLibrary.createdBy);
  }

  @Mutation(() => BadgeLibrary, { name: 'createBadgeLibrary' })
  async create(
    @Args('input') input: CreateBadgeLibraryInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(BadgeLibraryMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => BadgeLibrary, { name: 'updateBadgeLibrary' })
  async update(
    @Args('input') input: UpdateBadgeLibraryInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(BadgeLibraryMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
