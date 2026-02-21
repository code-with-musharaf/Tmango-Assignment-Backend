import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Challenge } from "src/database/schema/challenges.schema";
import { Submission } from "src/database/schema/submissions.schema";
import { S3Service } from "src/libs/uploadToS3Bucket.service";

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel("Challenge") private challengeModel: Model<Challenge>,
    @InjectModel("Submission") private submissionsModel: Model<Submission>,
    private readonly s3Service: S3Service,
  ) {}

  async createChallenge(challenge: Challenge): Promise<Challenge> {
    return this.challengeModel.create(challenge);
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  async getChallengeById(id: string): Promise<Challenge | null> {
    return this.challengeModel.findById(id).exec();
  }

  async joinChallenge(id: string): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(id).exec();
    if (!challenge) {
      throw new Error("Challenge not found");
    }
    challenge.joinedUsers.push(new mongoose.Types.ObjectId(id));
    return await challenge.save();
  }

  async createSubmission(submission: Submission): Promise<Submission> {
    try {
      let assetLink = submission.assetLink;
      const type = submission.assetType;
      if (!assetLink.startsWith("http") && !assetLink.startsWith("https")) {
        assetLink = await this.s3Service.uploadBase64(assetLink, type);
      }
      submission.assetLink = assetLink;
      return await this.submissionsModel.create(submission);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
