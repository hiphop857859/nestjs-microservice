import {
  EventLabel,
  EventLabelDocument,
} from './schemas/event-label.schema';

import { BaseService } from '@metahop/core';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActivityMicroserviceConfig
} from '@metahop/core';
import * as dotenv from 'dotenv';
import { ClientProxy } from '@nestjs/microservices';
dotenv.config();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
@Injectable()
export class EventLabelService extends BaseService<
  EventLabelDocument,
  any,
  any
> {
  constructor(
    @InjectModel(EventLabel.name)
    private eventLabelModel: Model<EventLabelDocument>,
    @Inject(activityMicroserviceConfig.name)
    activityMicroservice: ClientProxy,
  ) {
    super(eventLabelModel,activityMicroservice);
  }
}
