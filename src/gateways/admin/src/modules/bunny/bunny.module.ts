import { BunnyMicroserviceConfig } from '@metahop/core';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BunnyConfigResolver } from './resolvers/bunny-config.resolvers';
import { BunnyParrentResolver } from './resolvers/bunny-parrent.resolvers';
import { BunnyResolver } from './resolvers/bunny.resolvers';

const bunnyMicroserviceConfig = new BunnyMicroserviceConfig();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: bunnyMicroserviceConfig.name,
        ...bunnyMicroserviceConfig.microserviceOptions,
      },
    ]),
  ],
  providers: [BunnyResolver, BunnyConfigResolver, BunnyParrentResolver],
  controllers: [],
})
export class BunnyModule {}
