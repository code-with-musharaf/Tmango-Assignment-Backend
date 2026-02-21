import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseSchemas } from "src/database/schema";
import { ChallengeController } from "./challenge.controller";
import { ChallengeService } from "./challenge.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [MongooseModule.forFeature(DatabaseSchemas)],
  controllers: [ChallengeController],
  providers: [ChallengeService],
  exports: [ChallengeService],
})
export class ChallengeModule {}
