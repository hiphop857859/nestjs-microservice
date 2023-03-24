import {
  BaseMicroserviceController,
  SessionSpinMessagePattern,
} from '@metahop/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { SessionSpinService } from './sessionSpin.service';

@Controller('sessionSpin')
export class SessionSpinController extends BaseMicroserviceController(
  SessionSpinMessagePattern,
) {
  constructor(private readonly sessionSpinService: SessionSpinService) {
    super(sessionSpinService);
  }

  @MessagePattern(SessionSpinMessagePattern.LIST)
  async query(params: any) {
    try {
      const {
        condition,
        pagination,
        select,
        customCondition = {},
        user,
      } = params;
      return await this.sessionSpinService.query(
        condition,
        pagination,
        customCondition,
        select,
        user
      );
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
