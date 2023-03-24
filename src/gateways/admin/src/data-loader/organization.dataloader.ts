import {
  BaseDataLoader,
  OrgMessagePattern,
  OrganizationMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as DataLoader from 'dataloader';
import { firstValueFrom } from 'rxjs';
const organizationMicroserviceConfig = new OrganizationMicroserviceConfig();
export class OrganizationDataloader extends BaseDataLoader {
  constructor(
    @Inject(organizationMicroserviceConfig.name)
    private readonly organizationMicroservice: ClientProxy,
  ) {
    super(organizationMicroservice, OrgMessagePattern);
  }

  getLoaderById(): DataLoader<string, any> {
    return new DataLoader<string, any>(async (ids) => {
      // Fetch authors from database in a single query
      const data = await firstValueFrom(
        this.organizationMicroservice.send(OrgMessagePattern.GET_BY_IDS, {
          ids,
        }),
      );
      return ids.map(
        (id) => data.find((item: any) => item.mongoId === id) ?? null,
      );
    });
  }
}
