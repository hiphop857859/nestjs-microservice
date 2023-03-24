import {
  BaseMicroserviceController,
  EventHistoryMessagePattern,
} from '@metahop/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { IStatisticsCategory } from './event-history.interface';
import { EventHistoryService } from './event-history.service';

@Controller('eventHistory')
export class EventHistoryController extends BaseMicroserviceController(
  EventHistoryMessagePattern,
) {
  constructor(private readonly eventHistoryService: EventHistoryService) {
    super(eventHistoryService);
  }

  @MessagePattern(EventHistoryMessagePattern.CREATE)
  async create(params) {
    try {
      return await this.eventHistoryService.createBatch(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern(EventHistoryMessagePattern.STATISTICS_CATEGORY)
  async statisticsCategory(params: IStatisticsCategory) {
    try {
      return await this.eventHistoryService.statisticsCategory(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
