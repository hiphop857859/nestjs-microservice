import {
  BaseMicroserviceController,
  EventLabelMessagePattern,
} from '@metahop/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { EventLabelService } from './event-label.service';

@Controller('eventLabel')
export class EventLabelController extends BaseMicroserviceController(
  EventLabelMessagePattern,
) {
  constructor(private readonly eventLabelService: EventLabelService) {
    super(eventLabelService);
  }
}
