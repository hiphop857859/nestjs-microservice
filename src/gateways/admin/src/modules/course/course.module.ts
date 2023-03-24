import {
  EventMicroserviceConfig,
  QuizzMicroserviceConfig,
  CourseMicroserviceConfig,
  UserMicroserviceConfig,
  OrganizationMicroserviceConfig,
} from '@metahop/core';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CourseResolver } from './resolvers/course.resolvers';
import { CourseCategoryResolver } from './resolvers/course-category.resolvers';
import { CourseAttendeeResolver } from './resolvers/course-attendee.resolvers';
import { FeaturedCourseResolver } from './resolvers/featured-course.resolvers';
import { QuizzCourseResolver } from './resolvers/quizz-course.resolvers';

import { CourseCategoryDataloader } from '../../data-loader/course-category.dataloader';
import { CourseTagDataloader } from '../../data-loader/tag.dataloader';

import { QuizzResolver } from '../quizz/resolvers/quizz.resolvers';
import { CourseTagResolver } from '../course/resolvers/tag.resolvers';
import { OrganizationDataloader } from '../../data-loader/organization.dataloader';

import { AdministratorDataloader } from '../../data-loader/administrator.dataloader';
import { BadgeResolver } from './resolvers/badge.resolvers';
import { BadgeLibraryResolver } from './resolvers/badge-library.resolvers';
const organizationMicroserviceConfig = new OrganizationMicroserviceConfig();

import * as dotenv from 'dotenv';

dotenv.config();
const eventMicroserviceConfig = new EventMicroserviceConfig();
const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
const courseMicroserviceConfig = new CourseMicroserviceConfig();
const userMicroserviceConfig = new UserMicroserviceConfig();
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
    CourseResolver,
    CourseCategoryResolver,
    CourseAttendeeResolver,
    FeaturedCourseResolver,
    QuizzCourseResolver,
    QuizzResolver,
    CourseTagDataloader,
    CourseTagResolver,
    CourseCategoryDataloader,
    AdministratorDataloader,
    BadgeResolver,
    BadgeLibraryResolver,
    OrganizationDataloader,
  ],
  exports: [
    CourseTagDataloader,
    CourseCategoryDataloader,
    OrganizationDataloader,
  ],
  controllers: [],
})
export class CourseModule {}
