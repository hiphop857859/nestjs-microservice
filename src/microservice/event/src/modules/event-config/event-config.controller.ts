import {
  BaseMicroserviceController,
  EventConfigMessagePattern,
} from '@metahop/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { EventConfigService } from './event-config.service';

@Controller('eventConfig')
export class EventConfigController extends BaseMicroserviceController(
  EventConfigMessagePattern,
) {
  constructor(private readonly eventConfigService: EventConfigService) {
    super(eventConfigService);
  }

  @MessagePattern(EventConfigMessagePattern.CREATE)
  async create(params) {
    try {
      return await this.eventConfigService.create(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern(EventConfigMessagePattern.UPDATE)
  async update(params) {
    try {
      return await this.eventConfigService.update(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
