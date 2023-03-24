import { RpcException } from '@nestjs/microservices';
import {
  EventAttendee,
  EventAttendeeDocument,
} from './schemas/event-attendee.schema';

import { BaseService } from '@metahop/core';
import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayQuizzType } from '@metahop/graphql';
import {
  IDeleteHistoryPlay,
  IstatisticsEarn,
  IstatisticsPlaytime,
  IUserInformation,
} from './event-attendee.interface';
import { ObjectId } from 'mongodb';
import * as moment from 'moment';
import * as _ from 'lodash';
import { EventHistoryService } from '../event-history/event-history.service';
@Injectable()
export class EventAttendeeService extends BaseService<
  EventAttendeeDocument,
  any,
  any
> {
  constructor(
    @InjectModel(EventAttendee.name)
    private eventAttendeeModel: Model<EventAttendeeDocument>,
    private eventHistoryService: EventHistoryService,
  ) {
    super(eventAttendeeModel);
  }

  async statisticsEarn(params: IstatisticsEarn) {
    try {
      const { user, days = 0 } = params;
      const today = moment(new Date());
      const startDate = today.subtract(days - 1, 'days');
      const arrDate = [];
      for (let i = days - 1; i > -1; i--) {
        arrDate.push(
          moment(new Date()).subtract(i, 'days').format('YYYY-MM-DD'),
        );
      }
      const eventAttendees = await this.eventAttendeeModel.find(
        {
          status: PlayQuizzType.COMPLETED,
          playUserId: new ObjectId(user),
          createdAt: {
            $gte: startDate,
          },
        },
        {
          totalEarned: 1,
          createdAt: 1,
        },
      );
      const groupData = this._groupByDateEarn(eventAttendees);

      const result = arrDate.map((date) => {
        const data = groupData.find((item) => item.date === date);
        if (data) {
          return data;
        }
        // fill data empty
        return {
          date,
          data: {
            leap: 0,
            exp: 0,
          },
        };
      });
      return { result };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async statisticsPlaytime(params: IstatisticsPlaytime) {
    try {
      const { user, days = 0 } = params;
      const today = moment(new Date());
      const startDate = today.subtract(days - 1, 'days');
      const arrDate = [];
      for (let i = days - 1; i > -1; i--) {
        arrDate.push(
          moment(new Date()).subtract(i, 'days').format('YYYY-MM-DD'),
        );
      }
      const eventAttendees = await this.eventAttendeeModel
        .find(
          {
            status: PlayQuizzType.COMPLETED,
            playUserId: new ObjectId(user),
            createdAt: {
              $gte: startDate,
            },
          },
          {
            createdAt: 1,
            startAt: 1,
            endAt: 1,
          },
        )
        .exec();
      const groupData = this._groupByDateEarnPlaytime(eventAttendees);

      const result = arrDate.map((date) => {
        const data = groupData.find((item) => item.date === date);
        if (data) {
          return data;
        }
        // fill data empty
        return {
          date,
          data: {
            time: 0,
          },
        };
      });

      // get total time playing of user
      const totalItemsOfUser = await this.eventAttendeeModel
        .find(
          {
            playUserId: new ObjectId(user),
            status: PlayQuizzType.COMPLETED,
          },
          {
            startAt: 1,
            endAt: 1,
          },
        )
        .exec();
      const arrTotalTime = totalItemsOfUser.map((item) =>
        item.endAt
          ? new Date(item.endAt).getTime() - new Date(item.startAt).getTime()
          : 0,
      );

      return { result, total: _.sum(arrTotalTime) };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private _groupByDateEarn(data) {
    const groups = data.reduce((groups, item) => {
      const date = moment(item.createdAt).format('YYYY-MM-DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});

    return Object.keys(groups).map((date) => {
      const groupDate = groups[date];
      const groupTotal = groupDate.map((item) => item.totalEarned);
      return {
        date,
        data: {
          leap: _.sumBy(groupTotal, 'LEAP'),
          exp: _.sumBy(groupTotal, 'EXP'),
        },
      };
    });
  }

  private _groupByDateEarnPlaytime(data) {
    const groups = data.reduce((groups, item) => {
      const date = moment(item.createdAt).format('YYYY-MM-DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});

    return Object.keys(groups).map((date) => {
      const groupDate = groups[date];
      const groupTotal = groupDate.map(
        (item) =>
          new Date(item.endAt).getTime() - new Date(item.startAt).getTime(),
      );

      return {
        date,
        data: {
          time: _.sum(groupTotal),
        },
      };
    });
  }

  async deleteHistoryPlay(
    inputDeleteHistory: IDeleteHistoryPlay,
    user: IUserInformation,
  ) {
    try {
      await this.eventAttendeeModel
        .deleteMany({
          quizzId: inputDeleteHistory.quizzId,
          eventId: inputDeleteHistory?.eventId,
          playUserId: user.id,
        })
        .exec();
      await this.eventHistoryService.deleteEventHistoryPlay(
        inputDeleteHistory,
        user,
      );
      return true;
    } catch (error) {
      Logger.error(`${EventAttendee.name}: deleteHistoryPlay - `, error);
      throw error;
    }
  }
}
