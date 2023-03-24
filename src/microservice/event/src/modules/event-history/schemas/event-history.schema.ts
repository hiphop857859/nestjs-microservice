import { CustomMongooseDocument } from '@metahop/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type EventHistoryDocument = EventHistory & CustomMongooseDocument;
import { Schema as SchemaType } from 'mongoose';
@Schema({ collection: 'eventHistories' })
export class EventHistory {
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
    ref: 'events',
    default: null,
  })
  userId: SchemaType.Types.ObjectId;
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'questions',
    default: null,
  })
  questionId: SchemaType.Types.ObjectId;
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'eventAttendees',
    default: null,
  })
  attendeeId: SchemaType.Types.ObjectId;
  @Prop({
    type: [SchemaType.Types.ObjectId],
    default: [],
  })
  answerIds: string[];
  @Prop({
    type: Boolean,
    default: true,
  })
  isCorrectAnswer: boolean;

  @Prop({
    type: Object,
    default: null,
  })
  totalEarned: object;

  @Prop({
    type: String,
    default: null,
  })
  note: string;
}

export const EventHistorySchema = SchemaFactory.createForClass(EventHistory);
