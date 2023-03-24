import {
  LeaderBoardNewMessagePattern,
  ActivityMicroserviceConfig,
  FeJwtAuthGuard,
  CurrentUser,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  CreateLeaderBoardNewInput,
  FunctionName,
  LeaderBoardNew,
  LeaderBoardNewListReponse,
  LeaderBoardNewQueryInput,
  UpdateLeaderBoardNewInput,
} from '@metahop/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateLeaderBoardNewManyInput, LeaderBoardNewManyInput, UpdateLeaderBoardNewManyInput } from '../input/leader-board-new';

const activityMicroserviceConfig = new ActivityMicroserviceConfig();

@Resolver(() => LeaderBoardNew)
@UseGuards(AdminJwtAuthGuard)
export class LeaderBoardNewResolver extends BaseResolver<
  CreateLeaderBoardNewInput,
  UpdateLeaderBoardNewInput,
  LeaderBoardNewQueryInput
>({
  viewDto: LeaderBoardNew,
  createInput: CreateLeaderBoardNewInput,
  updateInput: UpdateLeaderBoardNewInput,
  listQueryInput: LeaderBoardNewQueryInput,
  listViewDto: LeaderBoardNewListReponse,
  name: 'leaderBoardNew',
  pluralName: 'leaderBoardNews',
  excludeFunctions: [],
}) {
  constructor(
    @Inject(activityMicroserviceConfig.name)
    private readonly activityMicroservice: ClientProxy,
  ) {
    super(activityMicroservice, LeaderBoardNewMessagePattern);
  }

  @ResolveField()
  async userId(@Parent() parent: LeaderBoardNew, @Context() { loaders }) {
    return await loaders.user.load(parent.userId);
  }

  @Mutation(() => LeaderBoardNewListReponse, {
    name: 'createLeaderBoardNewMany',
  })
  async createMany(
    @Args('input')
    input: CreateLeaderBoardNewManyInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.activityMicroservice.send(LeaderBoardNewMessagePattern.CREATE, {
        input,
        user,
      }),
    );
  }

  @Mutation(() => LeaderBoardNewListReponse, {
    name: 'updateLeaderBoardNewMany',
  })
  async updateMany(
    @Args('input')
    input: UpdateLeaderBoardNewManyInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.activityMicroservice.send(LeaderBoardNewMessagePattern.UPDATE, {
        input,
        user,
      }),
    );
  }
}
