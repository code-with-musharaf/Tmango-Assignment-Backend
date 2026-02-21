import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
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

  async createSubmission(
    id: string,
    submission: Submission,
    user: string,
  ): Promise<Submission> {
    try {
      let assetLink = submission.assetLink;
      const type = submission.assetType;

      const alreadySubmitted = await this.submissionsModel
        .findOne({
          challengeId: new mongoose.Types.ObjectId(id),
          userId: new mongoose.Types.ObjectId(user),
          dayCount: submission.dayCount,
        })
        .exec();

      if (alreadySubmitted) {
        throw new BadRequestException("You already submitted for this day");
      }

      // hdnling uploading asstet
      if (!assetLink.startsWith("http") && !assetLink.startsWith("https")) {
        assetLink = await this.s3Service.uploadBase64(assetLink, type);
      }
      if (!assetLink.startsWith("https")) {
        throw new InternalServerErrorException(
          "somehting went wrong while uploading asset",
        );
      }
      return await this.submissionsModel.create({
        ...submission,
        challengeId: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(user),
        assetLink,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSubmissionDetailsOfDay(
    id: string,
    dayCount: number,
    userId: string,
  ) {
    return this.submissionsModel
      .findOne({
        challengeId: new mongoose.Types.ObjectId(id),
        dayCount,
        userId: new mongoose.Types.ObjectId(userId),
      })
      .exec();
  }

  async getAllSubmissionOfUser(userId: string, challengeId: string) {
    return this.submissionsModel
      .find({
        userId: new mongoose.Types.ObjectId(userId),
        challengeId: new mongoose.Types.ObjectId(challengeId),
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
