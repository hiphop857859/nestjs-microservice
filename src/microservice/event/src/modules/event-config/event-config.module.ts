import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventConfigController } from './event-config.controller';
import { EventConfigService } from './event-config.service';
import { EventConfig, EventConfigSchema } from './schemas/event-config.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventConfig.name, schema: EventConfigSchema },
    ]),
  ],
  controllers: [EventConfigController],
  providers: [EventConfigService],
})
export class EventConfigModule {}
