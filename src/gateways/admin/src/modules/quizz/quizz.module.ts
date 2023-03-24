import {
  CourseMicroserviceConfig,
  QuizzMicroserviceConfig,
  UserMicroserviceConfig,
  EventMicroserviceConfig,
  OrganizationMicroserviceConfig,
} from '@metahop/core';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { QuestionResolver } from './resolvers/question.resolvers';
import { QuizzResolver } from './resolvers/quizz.resolvers';
import { QuizzHopanaResolver } from './resolvers/quizz-hopana.resolvers';


import { AnswerResolver } from './resolvers/answer.resolvers';
import { CategoryResolver } from './resolvers/category.resolvers';
import { RecomentQuizzResolver } from './resolvers/recoment-quizz.resolvers';
import { FeaturedQuizzResolver } from './resolvers/featured-quizz.resolvers';
import { QuizzUgcResolver } from './resolvers/quizz-ugc.resolvers';
import { FeedbackQuizzResolver } from './resolvers/feedback-quizz.resolvers';

import { QuestionDataloader } from '../../data-loader/question.dataloader';
import { CategoryDataloader } from '../../data-loader/category.dataloader';
import { QuizzDataloader } from '../../data-loader/quizz.dataloader';
import { AdministratorDataloader } from '../../data-loader/administrator.dataloader';
import { CourseTagDataloader } from '../../data-loader/tag.dataloader';
import * as dotenv from 'dotenv';
import { UserDataloader } from '../../data-loader/user.dataloader';
import { OrganizationDataloader } from '../../data-loader/organization.dataloader';
import { QuestionHopanaResolver } from './resolvers/question-hopana.resolvers';

dotenv.config();

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
const userMicroserviceConfig = new UserMicroserviceConfig();
const courseMicroserviceConfig = new CourseMicroserviceConfig();
const eventMicroserviceConfig = new EventMicroserviceConfig();
const organizationMicroserviceConfig = new OrganizationMicroserviceConfig();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: quizzMicroserviceConfig.name,
        ...quizzMicroserviceConfig.microserviceOptions,
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
        name: courseMicroserviceConfig.name,
        ...courseMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: eventMicroserviceConfig.name,
        ...eventMicroserviceConfig.microserviceOptions,
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
    QuestionResolver,
    QuizzResolver,
    QuizzUgcResolver,
    AnswerResolver,
    CategoryResolver,
    RecomentQuizzResolver,
    FeaturedQuizzResolver,
    QuizzHopanaResolver,
    QuestionHopanaResolver,
    FeedbackQuizzResolver,
    CategoryDataloader,
    QuestionDataloader,
    QuizzDataloader,
    AdministratorDataloader,
    CourseTagDataloader,
    UserDataloader,
    OrganizationDataloader,
  ],
  controllers: [],
  exports: [
    QuestionDataloader,
    CategoryDataloader,
    QuizzDataloader,
    AdministratorDataloader,
    CourseTagDataloader,
    UserDataloader,
    OrganizationDataloader,
  ],
})
export class QuizzModule {}
