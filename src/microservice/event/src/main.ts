import { EventMicroserviceConfig, timestampsPlugin } from '@metahop/core';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import mongoose from 'mongoose';
import { AppModule } from './app.module';

const metahopEventMicroserviceConfig = new EventMicroserviceConfig();

async function bootstrap() {
  mongoose.plugin(timestampsPlugin);
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(metahopEventMicroserviceConfig.microserviceOptions, {
    inheritAppConfig: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
