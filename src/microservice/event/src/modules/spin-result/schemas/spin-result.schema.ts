import { CustomMongooseDocument } from '@metahop/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType } from 'mongoose';
export type SpinResultDocument = SpinResult & CustomMongooseDocument;

@Schema({ collection: 'spinResults' })
export class SpinResult {
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'users',
    default: null,
  })
  playUserId: SchemaType.Types.ObjectId;
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'gifts',
    default: null,
  })
  giftId: SchemaType.Types.ObjectId;
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'sessionSpins',
    default: null,
  })
  sessionSpinId: SchemaType.Types.ObjectId;
  @Prop({
    type: Object,
  })
  information: object;
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
    type: Object,
    default: {
      HOP: 0,
      LEAP: 0,
      TURN: 0,
    },
  })
  bonus: object;
}

export const SpinResultSchema = SchemaFactory.createForClass(SpinResult);
