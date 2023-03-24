import { CustomMongooseDocument } from '@metahop/core';
import { GiftType } from '@metahop/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaType } from 'mongoose';

export type GiftDocument = Gift & CustomMongooseDocument;
@Schema({ collection: 'gifts' })
export class Gift {
  @Prop({
    type: String,
  })
  name: string;
  @Prop({
    type: SchemaType.Types.ObjectId,
    ref: 'sessionSpins',
    default: null,
  })
  sessionSpinId: SchemaType.Types.ObjectId;
  @Prop({
    type: String,
    enum: GiftType,
    default: GiftType.GIFT,
  })
  type: string;
  @Prop({
    type: String,
    default: '',
  })
  coverImage: string;
  @Prop({
    type: Number,
    default: 0,
  })
  quantity: number;
  @Prop({
    type: Number,
    default: 0,
  })
  probability: number;
  @Prop({
    type: Number,
    default: 0,
  })
  quantityReceived: number;
  @Prop({
    type: Number,
    default: 0,
  })
  playedUser: number;

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

export const GiftSchema = SchemaFactory.createForClass(Gift);
