import { CustomMongooseDocument } from '@metahop/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType } from 'mongoose';
import {
  DifficultyType,
  VisibilityType,
  ActiveType,
  Display,
  TimerType,
  EventConfigType,
  EventType,
} from '@metahop/graphql';

export type EventDocument = Event & CustomMongooseDocument;
export type EventConfig = {
  LEAP: 0;
  HOP: 0;
  USDT: 0;
  EXP: 0;
  resultType: 'UNCHECK';
  isShuffle: false;
  duration: 0;
  replay: 'UNCHECK';
  totalQuizScore: 0;
  turnCost: 0;
  hideResult: 'UNCHECK';
  stopper: 'UNCHECK';
  numberQuestionStop: 0;
};

export type QuestionConfig = {
  questionId: '';
  quizzId: '';
  config: {
    LEAP: 0;
    HOP: 0;
    USDT: 0;
    EXP: 0;
    duration: 0;
    turnCost: 0;
    questionScore: 0;
  };
};
export type Skill = {
  name: '';
  percent: '';
};

@Schema({ collection: 'events' })
export class Event {
  @Prop({
    type: String,
    enum: Display,
    default: Display.MOBILE,
  })
  display: string;
  @Prop({
    type: String,
    enum: EventType,
    default: EventType.EVENT,
  })
  type: string;
  @Prop({
    type: String,
    enum: TimerType,
    default: TimerType.NO_TIMER,
  })
  timerType: string;
  @Prop({
    type: String,
    default: '',
  })
  name: string;

  @Prop({
    type: String,
    default: '',
  })
  description: string;
  @Prop({
    type: String,
    enum: VisibilityType,
    default: VisibilityType.PUBLIC,
  })
  visibility: string;
  @Prop({
    type: String,
    default: '',
  })
  coverImage: string;

  @Prop({
    type: [SchemaType.Types.ObjectId],
    default: [],
  })
  quizzes: string[];

  @Prop({
    type: [SchemaType.Types.ObjectId],
    default: [],
  })
  labels: string[];
  @Prop({
    type: String,
    enum: DifficultyType,
    default: DifficultyType.EASY,
  })
  difficulty: string;
  @Prop({
    type: [SchemaType.Types.ObjectId],
    default: [],
  })
  categories: string[];

  @Prop({
    type: [SchemaType.Types.ObjectId],
    default: [],
  })
  tags: string[];
  @Prop({
    type: [SchemaType.Types.ObjectId],
    default: [],
  })
  tagQuizzes: string[];
  @Prop({
    type: String,
    enum: EventConfigType,
    default: EventConfigType.EVENT,
  })
  eventConfigType: string;
  @Prop({
    type: [Object],
    default: [],
  })
  configQuestion: QuestionConfig[];
  @Prop({
    type: [Object],
    default: [],
  })
  skills: Skill[];

  @Prop({
    type: Object,
    default: null,
  })
  config: EventConfig;
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
  @Prop({
    type: [String],
    default: null,
  })
  whitelistedEmails: string[];
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'orgs',
    default: null,
  })
  orgId: SchemaType.Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
