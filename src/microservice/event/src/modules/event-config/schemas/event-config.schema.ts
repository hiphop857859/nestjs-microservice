import { CustomMongooseDocument } from '@metahop/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type EventConfigDocument = EventConfig & CustomMongooseDocument;
import { Schema as SchemaType } from 'mongoose';

@Schema({ collection: 'eventConfigs' })
export class EventConfig {
  @Prop({
    type: String,
    default: 'DEFAULT',
  })
  key: string;

  @Prop({
    type: Object,
    default: null,
  })
  value: object;
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'users',
    default: null,
  })
  updatedBy: SchemaType.Types.ObjectId;
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'users',
    default: null,
  })
  createdBy: SchemaType.Types.ObjectId;
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'events',
    default: null,
  })
  eventId: SchemaType.Types.ObjectId;

}

export const EventConfigSchema = SchemaFactory.createForClass(EventConfig);
