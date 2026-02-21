import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ChallengeService } from "./challenge.service";
import { Challenge } from "src/database/schema/challenges.schema";
import { AuthGuard } from "src/guard/auth.guard";
import { CurrentUser } from "src/decorators/currentUser.decorator";
import { Submission } from "src/database/schema/submissions.schema";

@Controller("/api/challenge")
@UseGuards(AuthGuard)
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  async createChallenge(@Body() challenge: any): Promise<Challenge> {
    return this.challengeService.createChallenge(challenge);
  }

  @Get()
  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengeService.getAllChallenges();
  }

  @Get(":id")
  async getChallengeById(@Param("id") id: string): Promise<Challenge | null> {
    return this.challengeService.getChallengeById(id);
  }

  @Post(":id/join")
  async joinChallenge(@Param("id") id: string): Promise<Challenge> {
    return this.challengeService.joinChallenge(id);
  }

  @Post("submission/:id")
  async createSubmission(
    @Param("id") id: string,
    @Body() submission: any,
    @CurrentUser() user: string,
  ): Promise<Submission> {
    return this.challengeService.createSubmission(id, submission, user);
  }

  @Get("submission/:challengeId")
  async getAllSubmissionOfUser(
    @Param("challengeId") challengeId: string,
    @CurrentUser() user: string,
  ) {
    return this.challengeService.getAllSubmissionOfUser(user, challengeId);
  }
}
