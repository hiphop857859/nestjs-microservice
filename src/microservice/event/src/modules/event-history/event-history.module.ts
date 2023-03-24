import { QuizzMicroserviceConfig } from '@metahop/core';
import { ClientsModule } from '@nestjs/microservices';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventHistoryController } from './event-history.controller';
import { EventHistoryService } from './event-history.service';
import {
  EventHistory,
  EventHistorySchema,
} from './schemas/event-history.schema';

const quizzMicroserviceConfig = new QuizzMicroserviceConfig();
@Module({
  imports: [
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
  controllers: [EventHistoryController],
  providers: [EventHistoryService],
})
export class EventHistoryModule {}
