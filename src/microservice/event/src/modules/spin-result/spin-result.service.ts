import {
  SpinResult,
  SpinResultDocument,
  SpinResultSchema,
} from './schemas/spin-result.schema';
import {
  SessionSpin,
  SessionSpinDocument,
} from '../sessionSpin/schemas/sessionSpin.schema';
import { ObjectId } from 'mongodb';
import {
  BaseService,
  UserMicroserviceConfig,
  UsersBalanceMessagePattern,
} from '@metahop/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as _ from 'lodash';
import * as dotenv from 'dotenv';
import { ERROR_MESSAGE } from '../../constants';
import { GiftService } from '../gift/gift.service';
import { GiftType } from '@metahop/graphql';
import { VisibilityType } from '@metahop/graphql';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SessionSpinService } from '../sessionSpin/sessionSpin.service';
import { IGift, IUser } from './spin-result.interface';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

dotenv.config();
const userMicroserviceConfig = new UserMicroserviceConfig();
@Injectable()
export class SpinResultService extends BaseService<
  SpinResultDocument,
  any,
  any
> {
  constructor(
    @InjectModel(SpinResult.name)
    private spinResultModel: Model<SpinResultDocument>,
    private giftService: GiftService,
    private sessionSpinService: SessionSpinService,
    @Inject(userMicroserviceConfig.name)
    private userMicroservice: ClientProxy,

    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    super(spinResultModel);
  }

  async playLuckySpin(params) {
    const { user, input } = params;
    const sessionSpinId = input.sessionSpinId;
    const game = await this.stepOneCheckGame(user, sessionSpinId);
    await this.stepTwoTurnGame(user, game);
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const gifts = await this.giftService.getGift(game._id);

      let gift = await this.randomReward(gifts);
      if (!gift) {
        const quote = await this.giftService.randomGift(
          GiftType.QUOTE,
          game._id,
        );
        gift = quote[0];
      }
      if (!gift) {
        throw ERROR_MESSAGE.LUCKY_SPIN_PLAYED;
      }
      const spinResultData = {
        playUserId: user.id,
        giftId: gift._id,
        sessionSpinId: game._id,
        bonus: gift?.bonus,
      };
      const spinResult = await super.create(spinResultData);
      if (spinResult) {
        this.giftService.updateQuantityReceived(gift._id);
        this.userPlayInGift(user.id, game._id, gift._id);
        this.sendBonus(gift, user);
      }
      await session.commitTransaction();
      return { ...spinResult, gift: gift };
    } catch (error) {
      Logger.error(
        `${SpinResult.name}: Step4 - Transaction reward  - ` +
          JSON.stringify(error),
      );
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  async stepOneCheckGame(user, sessionSpinId) {
    try {
      const game = await this.sessionSpinService.findOne({
        _id: new ObjectId(sessionSpinId),
        isActive: true,
      });
      if (!game) throw ERROR_MESSAGE.LUCKY_SPIN_PLAYED;
      if (game.visibility == VisibilityType.PRIVATE) {
        const checkEmail = game.whitelistedEmails.includes(user?.email);
        if (!checkEmail) throw ERROR_MESSAGE.LUCKY_SPIN_PLAYED;
      }
      return game;
    } catch (error) {
      Logger.error(
        `${SpinResult.name}: StepOne - check game  - ` + JSON.stringify(error),
      );
      throw error;
    }
  }
  async stepTwoTurnGame(user, game) {
    try {
      const turnGame = await super.query(
        { playUserId: user.id, sessionSpinId: game._id },
        {},
      );

      if (turnGame.totalItems >= game.numberSpin) {
        throw ERROR_MESSAGE.LUCKY_SPIN_PLAYED;
      }
      return true;
    } catch (error) {
      Logger.error(
        `${SpinResult.name}: Step2 - check turn  - ` + JSON.stringify(error),
      );
      throw error;
    }
  }
  async randomReward(rewards) {
    try {
      rewards = rewards.filter(
        (reward) => reward.quantity > reward.quantityReceived,
      );
      const sum = _.sumBy(rewards, 'probability');
      let randomPoint = Math.floor(Math.random() * sum) + 0.1;
      for (let i = 0; i < rewards.length; i++) {
        if (randomPoint <= rewards[i].probability) {
          return rewards[i];
        } else {
          randomPoint -= rewards[i].probability;
        }
      }
      return;
    } catch (error) {
      Logger.error(
        `${SpinResult.name}: Step3 - random reward - ` + JSON.stringify(error),
      );
      throw error;
    }
  }
  async giftStatistic(sessionSpinId: string) {
    try {
      const totalPlayUser = await this.spinResultModel.aggregate([
        {
          $match: {
            sessionSpinId: new ObjectId(sessionSpinId),
          },
        },
        {
          $group: {
            _id: '$playUserId',
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            playUserId: { $sum: 1 },
          },
        },
      ]);
      const newCondition = {
        sessionSpinId: new ObjectId(sessionSpinId),
      };
      const pagination = {
        page: 1,
        pageSize: 1,
      };
      const select = ['_id'];
      const totalQuantityReceived = await super.query(
        newCondition,
        pagination,
        {},
        select,
      );
      return {
        totalPlayUser: totalPlayUser ? totalPlayUser[0]?.playUserId : 0,
        totalQuantityReceived: totalQuantityReceived.totalItems,
      };
    } catch (error) {
      Logger.error(
        `${SpinResult.name}: giftStatistic - ` + JSON.stringify(error),
      );
      throw error;
    }
  }

  async userPlayInGift(userId: string, sessionSpinId: string, giftId: string) {
    try {
      const turnGame = await super.query(
        { playUserId: userId, sessionSpinId: sessionSpinId, giftId: giftId },
        {},
      );

      if (turnGame.totalItems == 1) {
        this.giftService.updateUserPlayInGift(giftId);
      }
      return true;
    } catch (error) {
      Logger.error(
        `${SpinResult.name}: updateUserPlayInGift  - ` + JSON.stringify(error),
      );
      throw error;
    }
  }
  async sendBonus(gift: IGift, user: IUser) {
    try {
      firstValueFrom(
        this.userMicroservice.send(UsersBalanceMessagePattern.INCREASE, {
          userId: user.id,
          turn: gift.type === GiftType.TURN ? gift.bonus.TURN : 0,
          leap: gift.type === GiftType.LEAP ? gift.bonus.LEAP : 0,
          exp: 0,
          hop: gift.type === GiftType.HOP ? gift.bonus.HOP : 0,
        }),
      );
      return true;
      return true;
    } catch (error) {
      Logger.error(
        `${SpinResult.name}: Step completed - sendBonus  - ` +
          JSON.stringify(error),
      );
      throw error;
    }
  }
}
