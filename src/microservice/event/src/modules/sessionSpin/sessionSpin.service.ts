import { SessionSpin, SessionSpinDocument } from './schemas/sessionSpin.schema';

import {
  BaseService,
  ICustomConditionQuery,
  ICustomSelectQuery,
} from '@metahop/core';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import * as dotenv from 'dotenv';
import { ERROR_MESSAGE } from '../../constants';
import { GiftService } from '../gift/gift.service';
import { Gift, GiftDocument } from '../gift/schemas/gift.schema';
import { VisibilityType } from '@metahop/graphql';
dotenv.config();
@Injectable()
export class SessionSpinService extends BaseService<
  SessionSpinDocument,
  any,
  any
> {
  constructor(
    @InjectModel(SessionSpin.name)
    private spinResultModel: Model<SessionSpinDocument>,
    @InjectModel(Gift.name) private giftModel: Model<GiftDocument>,
    private giftService: GiftService,
  ) {
    super(spinResultModel);
  }
  async query(
    condition: any,
    pagination: any,
    customCondition?: ICustomConditionQuery,
    select?: ICustomSelectQuery,
    user?: any,
  ): Promise<any> {
    const newCondition = { ...condition };
    if (user) {
      const email = [user?.email];
      newCondition.$or = [
        { visibility: VisibilityType.PUBLIC },
        {
          visibility: VisibilityType.PRIVATE,
          whitelistedEmails: {
            $in: email,
          },
        },
        {
          startAt: { $lte: new Date() },
          endAt: { $gte: new Date() },
        },
      ];
    }
    return await super.query(newCondition, pagination, customCondition, select);
  }
}
