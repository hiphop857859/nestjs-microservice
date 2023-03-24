import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventLabelController } from './event-label.controller';
import { EventLabelService } from './event-label.service';
import { EventLabel, EventLabelSchema } from './schemas/event-label.schema';
import { ClientsModule, } from '@nestjs/microservices';
import {
  ActivityMicroserviceConfig
} from '@metahop/core';
import * as dotenv from 'dotenv';
dotenv.config();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventLabel.name, schema: EventLabelSchema },
    ]),
    ClientsModule.register([
      {
        name: activityMicroserviceConfig.name,
        ...activityMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  controllers: [EventLabelController],
  providers: [EventLabelService],
})
export class EventLabelModule {}
