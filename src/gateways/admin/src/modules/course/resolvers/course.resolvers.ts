import {
  CurrentUser,
  CourseMessagePattern,
  CourseMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  CourseQueryInput,
  CreateCourseInput,
  UpdateCourseInput,
  Course,
  CourseListReponse,
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
@Resolver(() => Course)
@UseGuards(AdminJwtAuthGuard)
export class CourseResolver extends BaseResolver<
  CreateCourseInput,
  UpdateCourseInput,
  CourseQueryInput
>({
  viewDto: Course,
  createInput: CreateCourseInput,
  updateInput: UpdateCourseInput,
  listQueryInput: CourseQueryInput,
  listViewDto: CourseListReponse,
  name: 'course',
  pluralName: 'courses',
}) {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, CourseMessagePattern);
  }
  @ResolveField()
  async courseCategories(@Parent() course:Course, @Context() { loaders }) {
    return await loaders.courseCategory.loadMany(course.courseCategories);
  }
  @ResolveField()
  async tags(@Parent() course:Course, @Context() { loaders }) {
    return await loaders.tagCourse.loadMany(course.tags);
  }
  @Mutation(() => Course, { name: 'createCourse' })
  async create(
    @Args('input')
    input: CreateCourseInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(CourseMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => Course, { name: 'updateCourse' })
  async update(
    @Args('input')
    input: UpdateCourseInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(CourseMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
