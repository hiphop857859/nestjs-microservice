import {
  CurrentUser,
  QuizzCourseMessagePattern,
  CourseMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  QuizzCourseQueryInput,
  CreateQuizzCourseInput,
  UpdateQuizzCourseInput,
  QuizzCourse,
  QuizzCourseListReponse,
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
@Resolver(() => QuizzCourse)
@UseGuards(AdminJwtAuthGuard)
export class QuizzCourseResolver extends BaseResolver<
  CreateQuizzCourseInput,
  UpdateQuizzCourseInput,
  QuizzCourseQueryInput
>({
  viewDto: QuizzCourse,
  createInput: CreateQuizzCourseInput,
  updateInput: UpdateQuizzCourseInput,
  listQueryInput: QuizzCourseQueryInput,
  listViewDto: QuizzCourseListReponse,
  name: 'quizzCourse',
  pluralName: 'quizzCourses',
}) {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, QuizzCourseMessagePattern);
  }

  @Mutation(() => QuizzCourse, { name: 'createQuizzCourse' })
  async create(
    @Args('input')
    input: CreateQuizzCourseInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(QuizzCourseMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => QuizzCourse, { name: 'updateQuizzCourse' })
  async update(
    @Args('input')
    input: UpdateQuizzCourseInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.courseMicroservice.send(QuizzCourseMessagePattern.UPDATE, {
        input,
        user,
        id,
      }),
    );
  }
}
