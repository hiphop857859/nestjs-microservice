import {
  BaseMicroserviceController,
  EventMessagePattern,
  ClientEventMessagePattern,
  TagsMessagePattern,
  CategoryMessagePattern,
} from '@metahop/core';
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { EventService } from './event.service';

@Controller('event')
export class EventController extends BaseMicroserviceController(
  EventMessagePattern,
) {
  constructor(private readonly eventService: EventService) {
    super(eventService);
  }
  @MessagePattern(EventMessagePattern.CREATE)
  async create(params) {
    try {
      return await this.eventService.create(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }
 
  @MessagePattern(EventMessagePattern.UPDATE)
  async update(params) {
    try {
      return await this.eventService.update(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }
  @MessagePattern(ClientEventMessagePattern.LIST_QUIZZ)
  async listQuizz(params) {
    try {
      return await this.eventService.listQuizzForApp(params);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern(TagsMessagePattern.DELETE)
  async deleteTagEvent(params) {
    try {
      const { id } = params;
      return await this.eventService.deleteTagsOfEvent(id);
    } catch (err) {
      throw new RpcException(err);
    }
  }

  @MessagePattern(CategoryMessagePattern.DELETE)
  async deleteCategoryEvent(params) {
    try {
      const { id } = params;
      return await this.eventService.deleteCategoriesOfEvent(id);
    } catch (err) {
      throw new RpcException(err);
    }
  }
}
