import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSpinController } from './sessionSpin.controller';
import { SessionSpinService } from './sessionSpin.service';
import { SessionSpin, SessionSpinSchema } from './schemas/sessionSpin.schema';
import { ClientsModule } from '@nestjs/microservices';
import { ActivityMicroserviceConfig } from '@metahop/core';
import * as dotenv from 'dotenv';
import { GiftService } from '../gift/gift.service';
import { Gift, GiftSchema } from '../gift/schemas/gift.schema';

dotenv.config();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SessionSpin.name, schema: SessionSpinSchema },
      { name: Gift.name, schema: GiftSchema },
    ]),
    ClientsModule.register([
      {
        name: activityMicroserviceConfig.name,
        ...activityMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  controllers: [SessionSpinController],
  providers: [SessionSpinService, GiftService],
})
export class SessionSpinModule {}
