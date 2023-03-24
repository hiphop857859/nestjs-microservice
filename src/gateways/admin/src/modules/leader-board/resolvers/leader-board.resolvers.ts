import {
  LeaderBoardMessagePattern,
  ActivityMicroserviceConfig,
  FeJwtAuthGuard,
  CurrentUser,
  AdminJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  CreateLeaderBoardInput,
  FunctionName,
  LeaderBoard,
  LeaderBoardListReponse,
  LeaderBoardQueryInput,
  UpdateLeaderBoardInput,
} from '@metahop/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';

const activityMicroserviceConfig = new ActivityMicroserviceConfig();

@Resolver(() => LeaderBoard)
@UseGuards(AdminJwtAuthGuard)
export class LeaderBoardResolver extends BaseResolver<
  CreateLeaderBoardInput,
  UpdateLeaderBoardInput,
  LeaderBoardQueryInput
>({
  viewDto: LeaderBoard,
  createInput: CreateLeaderBoardInput,
  updateInput: UpdateLeaderBoardInput,
  listQueryInput: LeaderBoardQueryInput,
  listViewDto: LeaderBoardListReponse,
  name: 'leaderBoard',
  pluralName: 'leaderBoards',
  excludeFunctions: [
    FunctionName.CREATE,
    FunctionName.UPDATE,
    FunctionName.DELETE,
  ],
}) {
  constructor(
    @Inject(activityMicroserviceConfig.name)
    private readonly activityMicroservice: ClientProxy,
  ) {
    super(activityMicroservice, LeaderBoardMessagePattern);
  }

  @ResolveField()
  async userId(@Parent() parent: LeaderBoard, @Context() { loaders }) {
    return await loaders.user.load(parent.userId);
  }
}
