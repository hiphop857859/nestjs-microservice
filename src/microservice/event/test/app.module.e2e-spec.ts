// import * as request from 'supertest';
import { testAppInit } from '@metahop/core';
import { AppModule } from './../src/app.module';

testAppInit({
  appName: 'EventMicroservice',
  module: AppModule,
});
