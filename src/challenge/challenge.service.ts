import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Challenge } from "src/database/schema/challenges.schema";
import { Submission } from "src/database/schema/submissions.schema";
import { User } from "src/database/schema/user.schema";
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

  async joinChallenge(id: string, user): Promise<Challenge> {
    const challenge = await this.challengeModel.findById(id).exec();
    if (!challenge) {
      throw new Error("Challenge not found");
    }
    challenge.joinedUsers.push(user._id);
    return await challenge.save();
  }

  async createSubmission(
    id: string,
    submission: Submission,
    user,
  ): Promise<Submission> {
    try {
      let assetLink = submission.assetLink;
      const type = submission.assetType;

      const challenge = await this.challengeModel
        .findOne({
          _id: new mongoose.Types.ObjectId(id),
          joinedUsers: new mongoose.Types.ObjectId(user?._id?.toString()),
        })
        .exec();
      if (!challenge) {
        throw new BadRequestException("You are not joined to this challenge");
      }

      const alreadySubmitted = await this.submissionsModel
        .findOne({
          challengeId: new mongoose.Types.ObjectId(id),
          userId: new mongoose.Types.ObjectId(user?._id?.toString()),
          dayCount: submission.dayCount,
        })
        .exec();

      if (alreadySubmitted) {
        throw new BadRequestException("You already submitted for this day");
      }

      // hdnling uploading asstet
      if (
        !!assetLink &&
        !assetLink.startsWith("http") &&
        !assetLink.startsWith("https")
      ) {
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
        userId: new mongoose.Types.ObjectId(user?._id?.toString()),
        assetLink,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSubmissionDetailsOfDay(
    challengeId: string,
    dayCount: number,
    userId: string,
  ) {
    let submissons = await this.submissionsModel.aggregate([
      {
        $match: {
          challengeId: new mongoose.Types.ObjectId(challengeId),
          dayCount: Number(dayCount),
          // userId: new mongoose.Types.ObjectId(userId.toString()),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          assetLink: 1,
          dayCount: 1,
          assetType: 1,
          challengeId: 1,
          userId: 1,
          user: 1,
          createdAt: 1,
        },
      },
    ]);
    const userPost = submissons.find(
      (submission) => submission.userId.toString() === userId.toString(),
    );

    if (userPost) {
      submissons = [
        userPost,
        ...submissons.filter(
          (submission) => submission.userId.toString() !== userId.toString(),
        ),
      ];
    }

    return {
      success: true,
      status: 200,
      data: submissons,
      userPost,
    };
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

  async checkUserJoinedChallenge(id: string, user: any): Promise<boolean> {
    const challenge = await this.challengeModel
      .findOne({
        _id: new mongoose.Types.ObjectId(id),
        joinedUsers: user._id,
      })
      .exec();
    return !!challenge;
  }
}
