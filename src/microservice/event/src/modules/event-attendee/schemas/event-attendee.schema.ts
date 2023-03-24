import { CustomMongooseDocument } from '@metahop/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type EventAttendeeDocument = EventAttendee & CustomMongooseDocument;
import { Schema as SchemaType } from 'mongoose';
import { PlayQuizzType } from '@metahop/graphql';
@Schema({ collection: 'eventAttendees' })
export class EventAttendee {
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'events',
    default: null,
  })
  eventId: SchemaType.Types.ObjectId;

  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'quizzes',
    default: null,
  })
  quizzId: SchemaType.Types.ObjectId;

  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'users',
    default: null,
  })
  playUserId: SchemaType.Types.ObjectId;

  @Prop({
    type: Object,
    default: null,
  })
  totalEarned: object;
  @Prop({
    type: Date,
    default: new Date(),
  })
  startAt: Date;

  @Prop({
    type: Date,
    default: new Date(),
  })
  endAt: Date;
  @Prop({
    type: Number,
    default: 0,
  })
  playTime: number;
  @Prop({
    type: String,
    enum: PlayQuizzType,
    default: PlayQuizzType.PENDING,
  })
  status: string;
  @Prop({
    type: Array,
    default: [],
  })
  results: [object];
  @Prop({
    type: Number,
    default: 0,
  })
  rightAnswer: number;
  @Prop({
    type: Number,
    default: 0,
  })
  wrongAnswer: number;
}

export const EventAttendeeSchema = SchemaFactory.createForClass(EventAttendee);
