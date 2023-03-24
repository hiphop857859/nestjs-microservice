import {
  BaseMicroserviceController,
  SpinResultMessagePattern,
} from '@metahop/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { SpinResultService } from './spin-result.service';

@Controller('spinResult')
export class SpinResultController extends BaseMicroserviceController(
  SpinResultMessagePattern,
) {
  constructor(private readonly spinResultService: SpinResultService) {
    super(spinResultService);
  }

  @MessagePattern(SpinResultMessagePattern.PLAY_LUCKY_SPIN)
  async playLuckySpin(params) {
    try {
      return await this.spinResultService.playLuckySpin(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern(SpinResultMessagePattern.STATISTIC)
  async giftStatistic(params: any) {
    try {
      const { sessionSpinId } = params;
      return await this.spinResultService.giftStatistic(sessionSpinId);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
