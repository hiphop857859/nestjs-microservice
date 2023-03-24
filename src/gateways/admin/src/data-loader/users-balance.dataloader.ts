import {
  BaseDataLoader,
  UsersBalanceMessagePattern,
  UserMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const userMicroserviceConfig = new UserMicroserviceConfig();

export class UsersBalanceDataloader extends BaseDataLoader {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly userMicroservice: ClientProxy,
  ) {
    super(userMicroservice, UsersBalanceMessagePattern);
  }
}
