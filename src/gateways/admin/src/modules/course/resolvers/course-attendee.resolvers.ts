import {
  CurrentUser,
  CourseAttendeeMessagePattern,
  CourseMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  CourseAttendeeQueryInput,
  CreateCourseAttendeeInput,
  UpdateCourseAttendeeInput,
  CourseAttendee,
  CourseAttendeeListReponse,
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
@Resolver(() => CourseAttendee)
@UseGuards(AdminJwtAuthGuard)
export class CourseAttendeeResolver extends BaseResolver<
  CreateCourseAttendeeInput,
  UpdateCourseAttendeeInput,
  CourseAttendeeQueryInput
>({
  viewDto: CourseAttendee,
  createInput: CreateCourseAttendeeInput,
  updateInput: UpdateCourseAttendeeInput,
  listQueryInput: CourseAttendeeQueryInput,
  listViewDto: CourseAttendeeListReponse,
  name: 'courseAttendee',
  pluralName: 'courseAttendees',
}) {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, CourseAttendeeMessagePattern);
  }

  @Mutation(() => CourseAttendee, { name: 'createCourseAttendee' })
  async create(
    @Args('input')
    input: CreateCourseAttendeeInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(CourseAttendeeMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => CourseAttendee, { name: 'updateCourseAttendee' })
  async update(
    @Args('input')
    input: UpdateCourseAttendeeInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(CourseAttendeeMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
