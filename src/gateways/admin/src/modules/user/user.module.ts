import {
  ActivityMicroserviceConfig,
  BunnyMicroserviceConfig,
  CourseMicroserviceConfig,
  EventMicroserviceConfig,
  SharedMicroserviceConfig,
  UserMicroserviceConfig,
} from '@metahop/core';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CourseTagDataloader } from '../../data-loader/tag.dataloader';
import { UsersBalanceDataloader } from '../../data-loader/users-balance.dataloader';
import { UsersKycDataloader } from '../../data-loader/users-kyc.dataloader';
import { JobLevelDataloader } from './../../data-loader/job-level.dataloader';
import { AdministratorResolver } from './resolvers/administrator.resolvers';
import { GroupResolver } from './resolvers/group.resolvers';
import { RoleResolver } from './resolvers/role.resolvers';
import { UserResolver } from './resolvers/user.resolvers';
import { PlanResolver } from './resolvers/plan.resolvers';
import { OrgResolver } from './resolvers/org.resolvers';
import { SubscriptionResolver } from './resolvers/subscription.resolvers';

import * as dotenv from 'dotenv';
import { UsersKycResolver } from './resolvers/user-kyc.resolvers';
import { PlayerResolver } from './resolvers/player.resolvers';

dotenv.config();
const userMicroserviceConfig = new UserMicroserviceConfig();
const courseMicroserviceConfig = new CourseMicroserviceConfig();
const sharedMicroserviceConfig = new SharedMicroserviceConfig();
const eventMicroserviceConfig = new EventMicroserviceConfig();
const bunnyMicroserviceConfig = new BunnyMicroserviceConfig();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: userMicroserviceConfig.name,
        ...userMicroserviceConfig.microserviceOptions,
      },
      {
        name: sharedMicroserviceConfig.name,
        ...sharedMicroserviceConfig.microserviceOptions,
      },
      {
        name: eventMicroserviceConfig.name,
        ...eventMicroserviceConfig.microserviceOptions,
      },
      {
        name: bunnyMicroserviceConfig.name,
        ...bunnyMicroserviceConfig.microserviceOptions,
      },
      {
        name: activityMicroserviceConfig.name,
        ...activityMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: courseMicroserviceConfig.name,
        ...courseMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  providers: [
    UserResolver,
    UsersKycResolver,
    AdministratorResolver,
    GroupResolver,
    RoleResolver,
    PlanResolver,
    OrgResolver,
    SubscriptionResolver,
    PlayerResolver,
    CourseTagDataloader,
    UsersBalanceDataloader,
    UsersKycDataloader,
    JobLevelDataloader,
  ],
  controllers: [],
  exports: [
    CourseTagDataloader,
    UsersBalanceDataloader,
    UsersKycDataloader,
    JobLevelDataloader,
  ],
})
export class UserModule {}
