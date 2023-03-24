import {
  BaseMicroserviceController,
  EventAttendeeMessagePattern,
} from '@metahop/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import {
  IDeleteHistoryPlay,
  IUserInformation,
} from './event-attendee.interface';
import { EventAttendeeService } from './event-attendee.service';

@Controller('eventAttendee')
export class EventAttendeeController extends BaseMicroserviceController(
  EventAttendeeMessagePattern,
) {
  constructor(private readonly eventAttendeeService: EventAttendeeService) {
    super(eventAttendeeService);
  }
  @MessagePattern(EventAttendeeMessagePattern.GET_USER_IN_EVENT)
  async statusPlay(params) {
    try {
      const { eventId, user } = params;
      const condition = {
        playUserId: user.id,
        eventId,
      };
      return await this.eventAttendeeService.findOne(condition);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern(EventAttendeeMessagePattern.STATISTICS_EARN)
  async statisticsEarn(params) {
    try {
      return await this.eventAttendeeService.statisticsEarn(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern(EventAttendeeMessagePattern.STATISTICS_PLAYTIME)
  async statisticsPlaytime(params) {
    try {
      return await this.eventAttendeeService.statisticsPlaytime(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern(EventAttendeeMessagePattern.DELETE_CONDITION)
  async deleteHistoryPlay(params) {
    try {
      const inputQuizz: IDeleteHistoryPlay = params.input;
      const user: IUserInformation = params.user;
      return await this.eventAttendeeService.deleteHistoryPlay(
        inputQuizz,
        user,
      );
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
