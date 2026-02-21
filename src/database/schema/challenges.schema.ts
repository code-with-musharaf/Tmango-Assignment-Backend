import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type ChallengeDocument = HydratedDocument<Challenge>;

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ default: "" })
  title: string;

  @Prop({ default: "" })
  description: string;

  @Prop({ name: "totalChallengeDays", type: Number })
  totalChallengeDays: number;

  @Prop({ default: [] })
  image: string[];

  @Prop({ default: [] })
  joinedUsers: Types.ObjectId[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
