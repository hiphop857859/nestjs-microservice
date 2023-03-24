import {
  SharedMicroserviceConfig,
  OrganizationMicroserviceConfig,
  UserMicroserviceConfig
} from '@metahop/core';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BannerResolver } from './resolvers/banner.resolvers';
import { SettingResolver } from './resolvers/setting.resolvers';
import { StaticPageResolver } from './resolvers/static-page.resolvers';
import { EmailResolver } from './resolvers/email.resolvers';
import { JobTitleResolver } from './resolvers/job-title.resolvers';
import { JobLevelResolver } from './resolvers/job-level.resolvers';
import { OrganizationDataloader } from '../../data-loader/organization.dataloader';
import { AdministratorDataloader } from '../../data-loader/administrator.dataloader';

const sharedMicroserviceConfig = new SharedMicroserviceConfig();
const organizationMicroserviceConfig = new OrganizationMicroserviceConfig();
const userMicroserviceConfig = new UserMicroserviceConfig();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: sharedMicroserviceConfig.name,
        ...sharedMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: organizationMicroserviceConfig.name,
        ...organizationMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: userMicroserviceConfig.name,
        ...userMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  providers: [
    StaticPageResolver,
    BannerResolver,
    SettingResolver,
    EmailResolver,
    JobTitleResolver,
    JobLevelResolver,
    OrganizationDataloader,
    AdministratorDataloader,
  ],
  controllers: [],
  exports: [AdministratorDataloader, OrganizationDataloader],
})
export class ShareModule {}
