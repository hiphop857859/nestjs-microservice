import {
  CurrentUser,
  FeaturedCourseMessagePattern,
  CourseMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  FeaturedCourseQueryInput,
  CreateFeaturedCourseInput,
  UpdateFeaturedCourseInput,
  FeaturedCourse,
  FeaturedCourseListReponse,
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
@Resolver(() => FeaturedCourse)
@UseGuards(AdminJwtAuthGuard)
export class FeaturedCourseResolver extends BaseResolver<
  CreateFeaturedCourseInput,
  UpdateFeaturedCourseInput,
  FeaturedCourseQueryInput
>({
  viewDto: FeaturedCourse,
  createInput: CreateFeaturedCourseInput,
  updateInput: UpdateFeaturedCourseInput,
  listQueryInput: FeaturedCourseQueryInput,
  listViewDto: FeaturedCourseListReponse,
  name: 'featuredCourse',
  pluralName: 'featuredCourses',
}) {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, FeaturedCourseMessagePattern);
  }

  @Mutation(() => FeaturedCourse, { name: 'createFeaturedCourse' })
  async create(
    @Args('input')
    input: CreateFeaturedCourseInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(FeaturedCourseMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => FeaturedCourse, { name: 'updateFeaturedCourse' })
  async update(
    @Args('input')
    input: UpdateFeaturedCourseInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(FeaturedCourseMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
