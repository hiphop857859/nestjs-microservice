import { UserDataloader } from '../../data-loader/user.dataloader';
import {
  ActivityMicroserviceConfig,
  UserMicroserviceConfig,
} from '@metahop/core';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

import * as dotenv from 'dotenv';
import { LeaderBoardResolver } from './resolvers/leader-board.resolvers';
import { LeaderBoardNewResolver } from './resolvers/leader-board-new.resolvers';

dotenv.config();

const activityMicroserviceConfig = new ActivityMicroserviceConfig();
const userMicroserviceConfig = new UserMicroserviceConfig();
@Module({
  imports: [
    ClientsModule.register([
      {
        name: activityMicroserviceConfig.name,
        ...activityMicroserviceConfig.microserviceOptions,
      },
      {
        name: userMicroserviceConfig.name,
        ...userMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  providers: [LeaderBoardResolver, LeaderBoardNewResolver, UserDataloader],
  exports: [UserDataloader],
  controllers: [],
})
export class LeaderBoardModule {}
