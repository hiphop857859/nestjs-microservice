import { Event, EventDocument } from './schemas/event.schema';

import {
  BaseService,
  CategoryMessagePattern,
  QuizzMicroserviceConfig,
  ICustomConditionQuery,
  ICustomSelectQuery,
} from '@metahop/core';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { VisibilityType } from '@metahop/graphql';
import { ActivityMicroserviceConfig } from '@metahop/core';
import * as dotenv from 'dotenv';
import { ClientProxy } from '@nestjs/microservices';
import { ERROR_MESSAGE } from '../../constants';
import { firstValueFrom } from 'rxjs';
dotenv.config();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
const quizzMicroserviceConfig = new QuizzMicroserviceConfig();

@Injectable()
export class EventService extends BaseService<EventDocument, any, any> {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @Inject(activityMicroserviceConfig.name)
    activityMicroservice: ClientProxy,
    @Inject(quizzMicroserviceConfig.name)
    private quizzMicroservice: ClientProxy,
  ) {
    super(eventModel, activityMicroservice);
  }

  async listQuizzForApp(params) {
    const { condition, pagination, key, user } = params;
    const email = [user?.email];
    const conditions: any = {
      deletedAt: { $exists: false },
      status: 1,
    };
    let sort: any = { _id: -1 };
    if (pagination?.sortBy && pagination?.orderBy) {
      sort = { [pagination.sortBy]: parseInt(pagination?.orderBy) };
    }
    if (key !== 'APP') {
      sort = { ...sort, attendees: -1 };
    }
    if (condition?.keyword) {
      const name = new RegExp(`${condition.keyword}`, 'i');
      conditions.$or = [{ name: name }, { 'search.id': name }];
    }

    if (condition?.categories) {
      conditions.categories = {
        $in: condition.categories.map((item) => new ObjectId(item)),
      };
    }
    if (condition?.timerType) {
      conditions.timerType = { $in: condition.timerType };
    }
    if (condition?.difficulty) {
      conditions.difficulty = { $in: condition.difficulty };
    }

    let page = 0;
    const pageSize = parseInt(pagination?.pageSize || 10);
    if (pagination?.page) {
      page = (parseInt(pagination.page) - 1) * pageSize;
    }
    const opt: any[] = [
      { $match: conditions },
      {
        $match: {
          $or: [
            { visibility: VisibilityType.PUBLIC },
            {
              visibility: VisibilityType.PRIVATE,
              whitelistedEmails: {
                $in: email,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'eventAttendees',
          let: { eventId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$eventId', '$$eventId'],
                },
              },
            },
            {
              $project: {
                _id: 1,
                eventId: 1,
                playUserId: 1,
              },
            },
            {
              $group: {
                _id: '$eventId',
                total: { $sum: 1 },
              },
            },
          ],
          as: 'totalAttendee',
        },
      },
      {
        $unwind: {
          path: '$totalAttendee',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          attendees: { $sum: '$totalAttendee.total' },
          voted: 0,
        },
      },
      { $sort: sort },
    ];
    let optModels = [...opt];
    optModels = optModels.concat([{ $skip: page }, { $limit: pageSize }]);
    const optTotal = [...opt].concat([{ $count: 'count' }]);
    const results = await this.eventModel.aggregate([
      {
        $facet: {
          items: optModels,
          totalItems: optTotal,
        },
      },
    ]);
    let items = [];
    let totalItems = 0;
    if (results[0].items.length > 0) {
      items = results[0].items;
      totalItems = results[0].totalItems[0].count;
    }
    return {
      items,
      totalItems,
      pagination,
      condition: conditions,
    };
  }

  async deleteTagsOfEvent(tagsId: string) {
    return await this.eventModel.updateMany(
      {},
      { $pull: { tags: new ObjectId(tagsId) } },
    );
  }

  async deleteCategoriesOfEvent(categoryId: string) {
    return await this.eventModel.updateMany(
      {},
      { $pull: { categories: new ObjectId(categoryId) } },
    );
  }

  async create(params) {
    const { input, user } = params;

    const data = await super.create(
      {
        ...input,
        createdBy: user.id,
      },
      user,
    );
    if (input?.categories.length > 0) {
      input?.categories.map((item) => {
        this.updateTotalCategoryEvent(item);
      });
    }
    return data;
  }

  async updateTotalCategoryEvent(categoryId) {
    const list = await super.query(
      {
        categories: {
          $in: categoryId,
        },
      },
      { page: 1, pageSize: 1 },
      {},
    );
    firstValueFrom(
      this.quizzMicroservice.send(CategoryMessagePattern.UPDATE, {
        id: categoryId,
        totalItems: list.totalItems,
      }),
    );
  }

  async update(params) {
    const { id, input, user } = params;
    const event = await super.findById(id);

    if (!event) throw ERROR_MESSAGE.EVENT_NOT_EXIT;
    const data = await super.update(
      id,
      {
        ...input,
        updatedBy: user.id,
      },
      user,
    );
    if (event?.categories.length > 0) {
      event?.categories.map((item) => {
        this.updateTotalCategoryEvent(item);
      });
    }
    if (input?.categories.length > 0) {
      input?.categories.map((item) => {
        this.updateTotalCategoryEvent(item);
      });
    }
    return data;
  }
  async query(
    condition: any,
    pagination: any,
    customCondition?: ICustomConditionQuery,
    select?: ICustomSelectQuery,
  ): Promise<any> {
    const newCondition = { ...condition };
    // // search with: username, email
    if (condition?.quizzIds) {
      newCondition.quizzes = {
        $in: condition?.quizzIds,
      };
    }

    return await super.query(newCondition, pagination, customCondition, select);
  }
}
