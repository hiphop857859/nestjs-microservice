import { BaseMicroserviceController, GiftMessagePattern } from '@metahop/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { GiftService } from './gift.service';

@Controller('gift')
export class GiftController extends BaseMicroserviceController(
  GiftMessagePattern,
) {
  constructor(private readonly giftService: GiftService) {
    super(giftService);
  }
}
