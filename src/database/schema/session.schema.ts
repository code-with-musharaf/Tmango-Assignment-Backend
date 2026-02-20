import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true })
export class Session {
  @Prop()
  startTime: string;

  @Prop()
  endTime: string;

  @Prop()
  duration: string;

  @Prop()
  milkQuantity: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
