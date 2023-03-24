import { Gift, GiftDocument } from './schemas/gift.schema';

import { BaseService } from '@metahop/core';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityMicroserviceConfig } from '@metahop/core';
import * as dotenv from 'dotenv';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { GiftType } from '@metahop/graphql';
dotenv.config();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
@Injectable()
export class GiftService extends BaseService<GiftDocument, any, any> {
  constructor(
    @InjectModel(Gift.name)
    private giftModel: Model<GiftDocument>,
    @Inject(activityMicroserviceConfig.name)
    activityMicroservice: ClientProxy,
  ) {
    super(giftModel, activityMicroservice);
  }

  async randomGift(type: string, sessionSpinId: string) {
    return await this.giftModel.aggregate([
      {
        $match: {
          deletedAt: { $exists: false },
          sessionSpinId: new ObjectId(sessionSpinId),
          type: type,
          isActive: true,
        },
      },
      { $sample: { size: 1 } },
    ]);
  }
  async getGift(sessionSpinId) {
    return await this.giftModel.find({
      deletedAt: { $exists: false },
      isActive: true,
      sessionSpinId: new ObjectId(sessionSpinId),
      type: {
        $ne: GiftType.QUOTE,
      },
    });
  }
  async updateQuantityReceived(gifId) {
    return await this.giftModel.updateOne(
      {
        _id: new ObjectId(gifId),
      },
      {
        $inc: { quantityReceived: 1 },
      },
    );
  }
  async updateUserPlayInGift(gifId: string) {
    return await this.giftModel.updateOne(
      {
        _id: new ObjectId(gifId),
      },
      {
        $inc: { playedUser: 1 },
      },
    );
  }
}
