import {
  ActivityMicroserviceConfig,
  CurrentUser,
  EventHistoryMessagePattern,
  EventMicroserviceConfig,
  FeJwtAuthGuard,
  LeaderBoardMessagePattern,
  UserMessagePattern,
  UserMicroserviceConfig,
  UsersLikesMessagePattern,
} from '@metahop/core';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  Player,
  PlayerQuizCategroryResponse,
  PlayerResultResponse,
} from '../typedefs/player.typedef';
import {
  PlayerInfoInput,
  PlayerQuizCategoryInput,
  PlayerResultInput,
} from '../inputs/player.input';

const userMicroserviceConfig = new UserMicroserviceConfig();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
const eventMicroserviceConfig = new EventMicroserviceConfig();

@Resolver(() => Player)
@UseGuards(FeJwtAuthGuard)
export class PlayerResolver {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly userMicroservice: ClientProxy,
    @Inject(activityMicroserviceConfig.name)
    private readonly activityMicroservice: ClientProxy,
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {}

  @Query(() => Player)
  async playerInfo(
    @Args('input')
    input: PlayerInfoInput,
  ) {
    return await firstValueFrom(
      this.userMicroservice.send(UserMessagePattern.GET, {
        id: input.id,
        select: [
          '_id',
          'email',
          'level',
          'avatar',
          'username',
          'nickname',
          'bio',
          'viewedCount',
          'likedCount',
        ],
      }),
    );
  }

  @Query(() => PlayerResultResponse)
  async playerResult(
    @Args('input')
    input: PlayerResultInput,
  ) {
    return await firstValueFrom(
      this.activityMicroservice.send(
        LeaderBoardMessagePattern.GET_RESULT_BY_USER,
        {
          ...input,
        },
      ),
    );
  }

  @Query(() => PlayerQuizCategroryResponse)
  async playerQuizCategory(
    @Args('input')
    input: PlayerQuizCategoryInput,
  ) {
    return await firstValueFrom(
      this.eventMicroservice.send(
        EventHistoryMessagePattern.STATISTICS_CATEGORY,
        {
          ...input,
        },
      ),
    );
  }

  @ResolveField()
  async isLiked(@Parent() parent: Player, @CurrentUser() user) {
    return await firstValueFrom(
      this.userMicroservice.send(UsersLikesMessagePattern.CHECK_EXIST, {
        userId: user.id,
        playerId: parent._id,
      }),
    );
  }
}
