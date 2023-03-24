import {
  CurrentUser,
  CourseCategoryMessagePattern,
  CourseMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  CourseCategoryQueryInput,
  CreateCourseCategoryInput,
  UpdateCourseCategoryInput,
  CourseCategory,
  CourseCategoryListReponse,
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
@Resolver(() => CourseCategory)
@UseGuards(AdminJwtAuthGuard)
export class CourseCategoryResolver extends BaseResolver<
  CreateCourseCategoryInput,
  UpdateCourseCategoryInput,
  CourseCategoryQueryInput
>({
  viewDto: CourseCategory,
  createInput: CreateCourseCategoryInput,
  updateInput: UpdateCourseCategoryInput,
  listQueryInput: CourseCategoryQueryInput,
  listViewDto: CourseCategoryListReponse,
  name: 'courseCategory',
  pluralName: 'courseCategories',
}) {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, CourseCategoryMessagePattern);
  }

  @Mutation(() => CourseCategory, { name: 'createCourseCategory' })
  async create(
    @Args('input')
    input: CreateCourseCategoryInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(CourseCategoryMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => CourseCategory, { name: 'updateCourseCategory' })
  async update(
    @Args('input')
    input: UpdateCourseCategoryInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(CourseCategoryMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
