import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { Event, EventSchema } from './schemas/event.schema';
import {
  ActivityMicroserviceConfig,
  QuizzMicroserviceConfig
} from '@metahop/core';
import * as dotenv from 'dotenv';
import { ClientsModule } from '@nestjs/microservices';
dotenv.config();
const activityMicroserviceConfig = new ActivityMicroserviceConfig();
const quizzMicroserviceConfig = new QuizzMicroserviceConfig();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    ClientsModule.register([
      {
        name: activityMicroserviceConfig.name,
        ...activityMicroserviceConfig.microserviceOptions,
      },
    ]),
    ClientsModule.register([
      {
        name: quizzMicroserviceConfig.name,
        ...quizzMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
