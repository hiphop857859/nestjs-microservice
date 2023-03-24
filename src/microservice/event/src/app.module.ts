import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from '@metahop/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './modules/event/event.module';
import { EventConfigModule } from './modules/event-config/event-config.module';
import { EventAttendeeModule } from './modules/event-attendee/event-attendee.module';
import { EventHistoryModule } from './modules/event-history/event-history.module';
import { EventLabelModule } from './modules/event-label/event-label.module';
import { GiftModule } from './modules/gift/gift.module';
import { SpinResultModule } from './modules/spin-result/spin-result.module';
import { SessionSpinModule } from './modules/sessionSpin/sessionSpin.module';



import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    MongooseModule.forRoot(process.env.EVENT_SERVICE_MONGODB_URL),
    HealthModule,
    EventModule,
    EventConfigModule,
    EventAttendeeModule,
    EventHistoryModule,
    EventLabelModule,
    GiftModule,
    SpinResultModule,
    SessionSpinModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
