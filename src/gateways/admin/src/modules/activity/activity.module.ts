import {
  ActivityMicroserviceConfig,
  UserMicroserviceConfig,
} from '@metahop/core';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { LogResolver } from './resolvers/log.resolvers';
import { AdministratorDataloader } from '../../data-loader/administrator.dataloader';
import * as dotenv from 'dotenv';
dotenv.config();
const userMicroserviceConfig = new UserMicroserviceConfig();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: userMicroserviceConfig.name,
        ...userMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: activityMicroserviceConfig.name,
        ...activityMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  providers: [LogResolver, AdministratorDataloader],
  exports: [AdministratorDataloader],
  controllers: [],
})
export class ActivityModule {}
