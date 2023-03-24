import {
  ActivityMicroserviceConfig,
  AdminJwtAuthGuard,
  BunnyMessagePattern,
  BunnyMicroserviceConfig,
  CurrentUser,
  EventAttendeeMessagePattern,
  EventMicroserviceConfig,
  UserMessagePattern,
  UserMicroserviceConfig,
  UsersDeviceHistoryMessagePattern,
  USER_TYPE,
} from '@metahop/core';
import {
  BaseResolver,
  UserQueryInput,
  CreateUserInput,
  UpdateUserInput,
  User,
  UserListReponse,
  FunctionName,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
  Query,
} from '@nestjs/graphql';

import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserResetPasswordInput } from '../inputs/user.input';
import { DeleteByAdminResponse } from '../typedefs/user.typedef';

const userMicroserviceConfig = new UserMicroserviceConfig();
const eventMicroserviceConfig = new EventMicroserviceConfig();
const bunnyMicroserviceConfig = new BunnyMicroserviceConfig();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();

@Resolver(() => User)
@UseGuards(AdminJwtAuthGuard)
export class UserResolver extends BaseResolver<
  CreateUserInput,
  UpdateUserInput,
  UserQueryInput
>({
  viewDto: User,
  createInput: CreateUserInput,
  updateInput: UpdateUserInput,
  listQueryInput: UserQueryInput,
  listViewDto: UserListReponse,
  name: 'user',
  pluralName: 'users',
  excludeFunctions: [FunctionName.CREATE],
}) {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly userMicroservice: ClientProxy,
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
    @Inject(bunnyMicroserviceConfig.name)
    private readonly bunnyMicroservice: ClientProxy,
    @Inject(activityMicroserviceConfig.name)
    private readonly activityMicroservice: ClientProxy,
  ) {
    super(userMicroservice, UserMessagePattern);
  }

  @ResolveField()
  async tags(@Parent() user: User, @Context() { loaders }) {
    return await loaders.tagCourse.loadMany(user.tags);
  }

  @ResolveField()
  async usersBalance(@Parent() parent: User, @Context() { loaders }) {
    return parent.usersBalance
      ? await loaders.usersBalance.load(parent.usersBalance)
      : null;
  }

  @ResolveField()
  async userType(@Parent() user: User) {
    return Number(await this.totalNFTOwned(user)) > 0
      ? USER_TYPE.USER_PAID
      : user.userType;
  }

  @ResolveField()
  async totalQuizzPlayed(@Parent() user: User) {
    const queryAttendee = {
      playUserId: user._id,
    };
    const attendee = await firstValueFrom(
      this.eventMicroservice.send(EventAttendeeMessagePattern.LIST, {
        condition: queryAttendee,
      }),
    );
    const quizzIds = attendee.items.map((item) => {
      return item.quizzId;
    });
    const quizzIdsUniq = [...new Set(quizzIds)];
    return quizzIdsUniq.length;
  }

  @ResolveField()
  async totalNFTOwned(@Parent() user: User) {
    if (!Array.isArray(user.walletAddress)) {
      return 0;
    }
    const wallets = user.walletAddress.map(
      (item: { address: string }) => item.address,
    );
    if (wallets.length === 0) {
      return 0;
    }
    const res = await firstValueFrom(
      this.bunnyMicroservice.send(BunnyMessagePattern.LIST, {
        condition: {
          userAddress: wallets,
        },
      }),
    );
    return res?.totalItems || 0;
  }

  @ResolveField()
  async devicesHistory(@Parent() user: User) {
    const res = await firstValueFrom(
      this.activityMicroservice.send(UsersDeviceHistoryMessagePattern.LIST, {
        condition: {
          user: user._id,
        },
        pagination: {
          pageSize: 10,
          sortBy: 'createdAt',
          orderBy: 'desc',
        },
      }),
    );

    return res?.items || [];
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @Args('isDeleted', { type: () => Boolean, defaultValue: false })
    isDeleted: boolean,
    @Info() info,
  ) {
    const select = info.fieldNodes[0].selectionSet.selections.map(
      (item) => item.name.value,
    );
    return await firstValueFrom(
      this.baseMicroservice.send(this.message.GET, { id, select, isDeleted }),
    );
  }

  @Mutation(() => User, { name: 'userResetPassword' })
  async resetPassword(
    @Args('input')
    input: UserResetPasswordInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.userMicroservice.send(UserMessagePattern.RESET_PASSWORD, {
        ...input,
        user,
      }),
    );
  }

  @Mutation(() => DeleteByAdminResponse, { name: 'deleteByAdmin' })
  async deleteByAdmin(
    @Args('input')
    input: UserResetPasswordInput,
    @CurrentUser() user,
  ) {
    return await firstValueFrom(
      this.userMicroservice.send(UserMessagePattern.DELETE_BY_ADMIN, {
        ...input,
        user,
      }),
    );
  }
}
