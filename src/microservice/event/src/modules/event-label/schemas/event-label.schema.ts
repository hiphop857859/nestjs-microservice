import { CustomMongooseDocument, TOGGLE_DISPLAY } from '@metahop/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType } from 'mongoose';
export type EventLabelDocument = EventLabel & CustomMongooseDocument;
import { ActiveType } from '@metahop/graphql';

@Schema({ collection: 'eventLabels' })
export class EventLabel {
  @Prop({
    type: String,
  })
  title: string;

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
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const EventLabelSchema = SchemaFactory.createForClass(EventLabel);
