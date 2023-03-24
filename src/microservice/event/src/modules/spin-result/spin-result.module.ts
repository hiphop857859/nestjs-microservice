import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpinResultController } from './spin-result.controller';
import { SpinResultService } from './spin-result.service';
import { SpinResult, SpinResultSchema } from './schemas/spin-result.schema';
import { ClientsModule } from '@nestjs/microservices';
import {
  ActivityMicroserviceConfig,
  UserMicroserviceConfig,
} from '@metahop/core';
import * as dotenv from 'dotenv';
import { GiftService } from '../gift/gift.service';

import { Gift, GiftSchema } from '../gift/schemas/gift.schema';
import {
  SessionSpin,
  SessionSpinSchema,
} from '../sessionSpin/schemas/sessionSpin.schema';
import { SessionSpinService } from '../sessionSpin/sessionSpin.service';

dotenv.config();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
const userMicroserviceConfig = new UserMicroserviceConfig();
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpinResult.name, schema: SpinResultSchema },
      { name: Gift.name, schema: GiftSchema },
      { name: SessionSpin.name, schema: SessionSpinSchema },
    ]),
    ClientsModule.register([
      {
        name: activityMicroserviceConfig.name,
        ...activityMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: userMicroserviceConfig.name,
        ...userMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  controllers: [SpinResultController],
  providers: [SpinResultService, GiftService, SessionSpinService],
})
export class SpinResultModule {}
