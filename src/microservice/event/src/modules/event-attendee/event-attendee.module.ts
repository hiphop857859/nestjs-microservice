import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventAttendeeController } from './event-attendee.controller';
import { EventAttendeeService } from './event-attendee.service';
import { EventHistoryService } from './../event-history/event-history.service';

import {
  EventAttendee,
  EventAttendeeSchema,
} from './schemas/event-attendee.schema';
import {
  EventHistory,
  EventHistorySchema,
} from '../event-history/schemas/event-history.schema';
import { QuizzMicroserviceConfig } from '@metahop/core';
import { ClientsModule } from '@nestjs/microservices';
const quizzMicroserviceConfig = new QuizzMicroserviceConfig();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventAttendee.name, schema: EventAttendeeSchema },
    ]),
    MongooseModule.forFeature([
      { name: EventHistory.name, schema: EventHistorySchema },
    ]),
    ClientsModule.register([
      {
        name: quizzMicroserviceConfig.name,
        ...quizzMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  controllers: [EventAttendeeController],
  providers: [EventAttendeeService, EventHistoryService],
})
export class EventAttendeeModule {}
