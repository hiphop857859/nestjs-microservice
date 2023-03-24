import {
  BaseDataLoader,
  EventLabelMessagePattern,
  EventMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const eventMicroserviceConfig = new EventMicroserviceConfig();
export class EventLabelDataloader extends BaseDataLoader {
  constructor(
    @Inject(eventMicroserviceConfig.name)
    private readonly eventMicroservice: ClientProxy,
  ) {
    super(eventMicroservice, EventLabelMessagePattern);
  }
}
