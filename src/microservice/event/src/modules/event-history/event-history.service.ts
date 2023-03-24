import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventHistory,
  EventHistoryDocument,
} from './schemas/event-history.schema';

import {
  BaseService,
  QuizzMicroserviceConfig,
  QuizzMessagePattern,
  CategoryMessagePattern,
} from '@metahop/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStatisticsCategory } from './event-history.interface';
import {
  IDeleteHistoryPlay,
  IUserInformation,
} from '../event-attendee/event-attendee.interface';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
@Injectable()
export class EventHistoryService extends BaseService<
  EventHistoryDocument,
  any,
  any
> {
  constructor(
    @InjectModel(EventHistory.name)
    private eventHistoryModel: Model<EventHistoryDocument>,
    @Inject(quizzMicroserviceConfig.name)
    private readonly quizzMicroservice: ClientProxy,
  ) {
    super(eventHistoryModel);
  }
  async createBatch(params) {
    const { input, attendeeId } = params;
    const arr = input.results.map((item) => {
      return {
        eventId: input?.eventId,
        quizzId: input?.quizzId,
        userId: input?.playUserId,
        questionId: item.questionId,
        attendeeId,
        answerIds: item.answerIds,
        isCorrectAnswer: item.isCorrectAnswer,
        totalEarned: item.reward,
        createdAt: item.createdAt,
        note: item?.note,
      };
    });

    const data = await this.eventHistoryModel.insertMany(arr);
    return data;
  }

  async statisticsCategory(params: IStatisticsCategory) {
    const items = await this.eventHistoryModel.find(
      {
        userId: new Object(params.id),
      },
      { quizzId: 1 },
    );

    const quizIds = items.map((item) => item.quizzId);
    const quizzes = await firstValueFrom(
      this.quizzMicroservice.send(QuizzMessagePattern.BATCH_GET_IDS, {
        ids: quizIds,
      }),
    );
    let categoryIds = [];
    quizzes.forEach((quiz) => {
      categoryIds = [...categoryIds, ...quiz.categories];
    });

    const categories = await firstValueFrom(
      this.quizzMicroservice.send(CategoryMessagePattern.BATCH_GET_IDS, {
        ids: [...new Set(categoryIds)],
      }),
    );
    const categoryMap = [...new Set(categoryIds)].map((id) =>
      categories.find((item) => item._id === id),
    );

    const map = categoryIds.reduce(
      (a, c) => ((a[c] = a[c] || 0), a[c]++, a),
      {},
    );

    const result = Object.keys(map).map((s) => ({
      category: categoryMap.find((item) => item._id === s),
      count: map[s],
    }));

    return { result };
  }

  async deleteEventHistoryPlay(
    inputDeleteHistory: IDeleteHistoryPlay,
    user: IUserInformation,
  ) {
    try {
      await this.eventHistoryModel
        .deleteMany({
          quizzId: inputDeleteHistory.quizzId,
          eventId: inputDeleteHistory?.eventId,
          userId: user.id,
        })
        .exec();
      return true;
    } catch (error) {
      Logger.error(`${EventHistory.name}: deleteEventHistoryPlay - `, error);
      throw error;
    }
  }
}
