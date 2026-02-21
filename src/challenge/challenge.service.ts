import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Challenge } from "src/database/schema/challenges.schema";

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel("Challenge") private challengeModel: Model<Challenge>,
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
}
