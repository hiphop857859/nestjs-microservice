import { AuthenticationContext, HealthModule } from '@metahop/core';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';
import { QuizzModule } from './modules/quizz/quizz.module';
import { UserModule } from './modules/user/user.module';
import { BunnyModule } from './modules/bunny/bunny.module';
import { EventModule } from './modules/event/event.module';
import { CourseModule } from './modules/course/course.module';
import { ActivityModule } from './modules/activity/activity.module';
import { LeaderBoardModule } from './modules/leader-board/leader-board.module';


import { Context } from 'apollo-server-core';

import { QuestionDataloader } from './data-loader/question.dataloader';
import { CategoryDataloader } from './data-loader/category.dataloader';
import { CourseCategoryDataloader } from './data-loader/course-category.dataloader';
import { CourseTagDataloader } from './data-loader/tag.dataloader';
import { AdministratorDataloader } from './data-loader/administrator.dataloader';
import { UserDataloader } from './data-loader/user.dataloader';
import { OrganizationDataloader } from './data-loader/organization.dataloader';
import { UsersBalanceDataloader } from './data-loader/users-balance.dataloader';
import { UsersKycDataloader } from './data-loader/users-kyc.dataloader';
import { JobLevelDataloader } from './data-loader/job-level.dataloader';
import { QuizzDataloader } from './data-loader/quizz.dataloader';
import { ShareModule } from './modules/shared/shared.module';
import { EventLabelDataloader } from './data-loader/event-label.dataloader';

import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { hideFunctionDirectiveTransformer } from '@metahop/graphql';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [
        UserModule,
        QuizzModule,
        BunnyModule,
        EventModule,
        ShareModule,
        CourseModule,
        ActivityModule,
      ],
      useFactory: (
        questionDataloader: QuestionDataloader,
        categoryDataloader: CategoryDataloader,
        quizzDataloader: QuizzDataloader,
        courseCategoryDataloader: CourseCategoryDataloader,
        tagDataloader: CourseTagDataloader,
        eventLabelDataloader: EventLabelDataloader,
        administratorDataloader: AdministratorDataloader,
        userDataloader: UserDataloader,
        organizationDataloader: OrganizationDataloader,
        usersBalanceDataloader: UsersBalanceDataloader,
        usersKycDataloader: UsersKycDataloader,
        jobLevelDataloader: JobLevelDataloader,
      ) => {
        return {
          playground: true,
          autoSchemaFile: true,
          introspection: true,
          cache: 'bounded',
          transformSchema: (schema) =>
            hideFunctionDirectiveTransformer(
              schema,
              'hideQuery',
              'hideMutation',
            ),
          buildSchemaOptions: {
            directives: [
              new GraphQLDirective({
                name: 'hideQuery',
                locations: [DirectiveLocation.QUERY],
              }),
              new GraphQLDirective({
                name: 'hideMutation',
                locations: [DirectiveLocation.MUTATION],
              }),
            ],
          },
          context: ({ req, connection }): Context => {
            const context = connection ? connection.context : req;
            try {
              AuthenticationContext(context);
            } catch (error) {
              throw new AuthenticationError(error);
            }
            return {
              loaders: {
                question: questionDataloader.getLoader(),
                category: categoryDataloader.getLoader(),
                quizz: quizzDataloader.getLoader(),
                courseCategory: courseCategoryDataloader.getLoader(),
                tagCourse: tagDataloader.getLoader(),
                eventLabel: eventLabelDataloader.getLoader(),
                totalCategory: quizzDataloader.count(),
                administrator: administratorDataloader.getLoader(),
                user: userDataloader.getLoader(),
                organization: organizationDataloader.getLoaderById(),
                usersBalance: usersBalanceDataloader.getLoader(),
                usersKyc: usersKycDataloader.getLoader(),
                jobLevel: jobLevelDataloader.getLoader(),
              },
            };
          },
        };
      },

      inject: [
        QuestionDataloader,
        CategoryDataloader,
        QuizzDataloader,
        CourseCategoryDataloader,
        CourseTagDataloader,
        EventLabelDataloader,
        AdministratorDataloader,
        UserDataloader,
        OrganizationDataloader,
        UsersBalanceDataloader,
        UsersKycDataloader,
        JobLevelDataloader,
      ],
    }),
    HealthModule,
    UserModule,
    QuizzModule,
    BunnyModule,
    EventModule,
    ShareModule,
    CourseModule,
    ActivityModule,
    LeaderBoardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
