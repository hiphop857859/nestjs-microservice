import {
  BaseDataLoader,
  CourseTagMessagePattern,
  CourseMicroserviceConfig,
} from '@metahop/core';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

const courseMicroserviceConfig = new CourseMicroserviceConfig();
export class CourseTagDataloader extends BaseDataLoader {
  constructor(
    @Inject(courseMicroserviceConfig.name)
    private readonly courseMicroservice: ClientProxy,
  ) {
    super(courseMicroservice, CourseTagMessagePattern);
  }
}
