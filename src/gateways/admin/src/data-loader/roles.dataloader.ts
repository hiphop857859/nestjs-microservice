import {
  BaseDataLoader,
  RoleMessagePattern,
  UserMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const userMicroserviceConfig = new UserMicroserviceConfig();

export class RoleDataloader extends BaseDataLoader {
  constructor(
    @Inject(userMicroserviceConfig.name)
    private readonly userMicroservice: ClientProxy,
  ) {
    super(userMicroservice, RoleMessagePattern);
  }
}
