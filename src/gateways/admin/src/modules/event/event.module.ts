import {
  CourseMicroserviceConfig,
  EventMicroserviceConfig,
  QuizzMicroserviceConfig,
  UserMicroserviceConfig,
  OrganizationMicroserviceConfig
} from '@metahop/core';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventResolver } from './resolvers/event.resolvers';
import { EventConfigResolver } from './resolvers/event-config.resolvers';
import { EventAttendeeResolver } from './resolvers/event-attendee.resolvers';
import { EventHistoryResolver } from './resolvers/event-history.resolvers';
import { EventLabelResolver } from './resolvers/event-label.resolvers';
import { SessionSpinResolver } from './resolvers/session-spin.resolvers';


import { QuizzDataloader } from '../../data-loader/quizz.dataloader';
import { CategoryDataloader } from '../../data-loader/category.dataloader';

import { EventLabelDataloader } from '../../data-loader/event-label.dataloader';
import { QuizzResolver } from '../quizz/resolvers/quizz.resolvers';
import { CourseTagDataloader } from '../../data-loader/tag.dataloader';
import { AdministratorDataloader } from '../../data-loader/administrator.dataloader';

import * as dotenv from 'dotenv';
import { GiftResolver } from './resolvers/gift.resolvers';
import { SpinResultResolver } from './resolvers/spin-result';
import { OrganizationDataloader } from '../../data-loader/organization.dataloader';
dotenv.config();
const eventMicroserviceConfig = new EventMicroserviceConfig();
const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
const courseMicroserviceConfig = new CourseMicroserviceConfig();
const userMicroserviceConfig = new UserMicroserviceConfig();
const organizationMicroserviceConfig = new OrganizationMicroserviceConfig();


@Module({
  imports: [
    ClientsModule.register([
      {
        name: eventMicroserviceConfig.name,
        ...eventMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: quizzMicroserviceConfig.name,
        ...quizzMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: courseMicroserviceConfig.name,
        ...courseMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: userMicroserviceConfig.name,
        ...userMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: organizationMicroserviceConfig.name,
        ...organizationMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  providers: [
    EventResolver,
    EventAttendeeResolver,
    EventHistoryResolver,
    EventConfigResolver,
    EventLabelResolver,
    SessionSpinResolver,
    SpinResultResolver,
    CategoryDataloader,
    GiftResolver,
    QuizzResolver,
    QuizzDataloader,
    EventLabelDataloader,
    CourseTagDataloader,
    AdministratorDataloader,
    OrganizationDataloader
  ],
  exports: [
    QuizzDataloader,
    EventLabelDataloader,
    CourseTagDataloader,
    AdministratorDataloader,
    CategoryDataloader,
    OrganizationDataloader
  ],
  controllers: [],
})
export class EventModule {}
