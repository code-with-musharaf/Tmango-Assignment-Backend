import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type SubmissionDocument = HydratedDocument<Submission>;

export enum EAssetType {
  IMAGE = "image",
  VIDEO = "video",
}

@Schema({ timestamps: true })
export class Submission {
  @Prop({ default: "" })
  title: string;

  @Prop({ default: "" })
  description: string;

  @Prop({ default: "" })
  assetLink: string;

  @Prop({ required: true, type: Number })
  dayCount: number;

  @Prop({ default: null, required: true, enum: EAssetType, nullable: true })
  assetType: EAssetType;

  @Prop({ default: "" })
  challengeId: Types.ObjectId;

  @Prop({ default: "" })
  userId: Types.ObjectId;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
