import {
  CurrentUser,
  CourseTagMessagePattern,
  CourseMicroserviceConfig,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  CourseTagQueryInput,
  CreateCourseTagInput,
  UpdateCourseTagInput,
  CourseTag,
  CourseTagListReponse,
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
@Resolver(() => CourseTag)
@UseGuards(AdminJwtAuthGuard)
export class CourseTagResolver extends BaseResolver<
  CreateCourseTagInput,
  UpdateCourseTagInput,
  CourseTagQueryInput
>({
  viewDto: CourseTag,
  createInput: CreateCourseTagInput,
  updateInput: UpdateCourseTagInput,
  listQueryInput: CourseTagQueryInput,
  listViewDto: CourseTagListReponse,
  name: 'courseTag',
  pluralName: 'courseTags',
}) {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, CourseTagMessagePattern);
  }
  @ResolveField()
  async createdBy(@Parent() courseTag: CourseTag, @Context() { loaders }) {
    return await loaders.administrator.load(courseTag.createdBy);
  }
  @ResolveField()
  async orgId(@Parent() courseTag: CourseTag, @Context() { loaders }) {
    return await loaders.organization.load(courseTag.orgId);
  }
  @Mutation(() => CourseTag, { name: 'createCourseTag' })
  async create(
    @Args('input')
    input: CreateCourseTagInput,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.courseMicroservice.send(CourseTagMessagePattern.CREATE, {
        input: dataOrg,
        user,
      }),
    );
  }

  @Mutation(() => CourseTag, { name: 'updateCourseTag' })
  async update(
    @Args('input')
    input: UpdateCourseTagInput,
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user,
  ) {
    const dataOrg = user.orgId ? { ...input, orgId: user.orgId } : input;
    return await firstValueFrom(
      this.courseMicroservice.send(CourseTagMessagePattern.UPDATE, {
        input: dataOrg,
        user,
        id,
      }),
    );
  }

  @Query(() => CourseTagListReponse, { name: 'courseTags' })
  async findAll(
    @Args('query', {
      type: () => CourseTagQueryInput,
      nullable: true,
      defaultValue: {},
    })
    query: CourseTagQueryInput,
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
      this.courseMicroservice.send(CourseTagMessagePattern.LIST, {
        condition: dataOrg,
        pagination,
        select: select,
      }),
    );
  }
}
