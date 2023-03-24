import {
  EventConfig,
  EventConfigDocument,
} from './schemas/event-config.schema';

import { BaseService } from '@metahop/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class EventConfigService extends BaseService<
  EventConfigDocument,
  any,
  any
> {
  constructor(
    @InjectModel(EventConfig.name)
    private eventConfigModel: Model<EventConfigDocument>,
  ) {
    super(eventConfigModel);
  }

  async create(params) {
    const { input, user } = params;
    return await super.create(
      {
        ...input,
        createdBy: user.id,
      },
      user,
    );
  }

  async update(params) {
    const { input, id, user } = params;

    return await super.update(
      id,
      {
        ...input,
        updatedBy: user.id,
      },
      user,
    );
  }
}
