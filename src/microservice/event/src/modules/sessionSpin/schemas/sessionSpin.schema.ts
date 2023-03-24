import { CustomMongooseDocument } from '@metahop/core';
import { VisibilityType } from '@metahop/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType } from 'mongoose';
export type SessionSpinDocument = SessionSpin & CustomMongooseDocument;

@Schema({ collection: 'sessionSpins' })
export class SessionSpin {
  @Prop({
    type: String,
  })
  name: string;
  @Prop({
    type: String,
    default: '',
  })
  coverImage: string;
  @Prop({
    type: Number,
    default: 0,
  })
  numberSpin: number;
  @Prop({
    type: Number,
    default: 0,
  })
  costTurn: number;
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
    type: String,
    enum: VisibilityType,
    default: VisibilityType.PUBLIC,
  })
  visibility: string;
  @Prop({
    type: [String],
    default: [],
  })
  whitelistedEmails: string[];

}

export const SessionSpinSchema = SchemaFactory.createForClass(SessionSpin);
