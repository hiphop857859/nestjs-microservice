import {
  UsersKycMessagePattern,
  UserMicroserviceConfig,
  FeJwtAuthGuard,
} from '@metahop/core';
import {
  BaseResolver,
  UsersKycQueryInput,
  CreateUsersKycInput,
  UpdateUsersKycInput,
  UsersKyc,
  UsersKycListReponse,
  FunctionNameCRUD,
} from '@metahop/graphql';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserKycInput } from '../inputs/user.input';

const userMicroserviceConfig = new UserMicroserviceConfig();

@Resolver(() => UsersKyc)
@UseGuards(FeJwtAuthGuard)
export class UsersKycResolver extends BaseResolver<
  CreateUsersKycInput,
  UpdateUsersKycInput,
  UsersKycQueryInput
>({
  viewDto: UsersKyc,
  createInput: CreateUsersKycInput,
  updateInput: UpdateUsersKycInput,
  listQueryInput: UsersKycQueryInput,
  listViewDto: UsersKycListReponse,
  name: 'usersKyc',
  pluralName: 'usersKyc',
  excludeFunctions: FunctionNameCRUD,
}) {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly userMicroservice: ClientProxy,
  ) {
    super(userMicroservice, UsersKycMessagePattern);
  }

  @ResolveField()
  async categories(@Parent() userKyc: UsersKyc, @Context() { loaders }) {
    if (!userKyc.categories) {
      return null;
    }
    return await loaders.category.loadMany(userKyc.categories);
  }

  @ResolveField()
  async jobLevel(@Parent() userKyc: UsersKyc, @Context() { loaders }) {
    if (!userKyc.jobLevel) {
      return null;
    }
    return await loaders.jobLevel.load(userKyc.jobLevel);
  }

  @Query(() => UsersKyc, { name: 'userKyc' })
  async userKyc(
    @Args('input')
    input: UserKycInput,
  ) {
    const { userId } = input;
    const res = await firstValueFrom(
      this.baseMicroservice.send(UsersKycMessagePattern.GET_BY_USER, {
        user: userId,
      }),
    );

    return res || {};
  }
}
