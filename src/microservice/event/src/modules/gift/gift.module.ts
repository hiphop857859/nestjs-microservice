import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftController } from './gift.controller';
import { GiftService } from './gift.service';
import { Gift, GiftSchema } from './schemas/gift.schema';
import { ClientsModule } from '@nestjs/microservices';
import { ActivityMicroserviceConfig } from '@metahop/core';
import * as dotenv from 'dotenv';
dotenv.config();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gift.name, schema: GiftSchema }]),
    ClientsModule.register([
      {
        name: activityMicroserviceConfig.name,
        ...activityMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  controllers: [GiftController],
  providers: [GiftService],
})
export class GiftModule {}
