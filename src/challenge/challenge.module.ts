import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseSchemas } from "src/database/schema";
import { ChallengeController } from "./challenge.controller";
import { ChallengeService } from "./challenge.service";
import { Module } from "@nestjs/common";
import { S3Service } from "src/libs/uploadToS3Bucket.service";

@Module({
  imports: [MongooseModule.forFeature(DatabaseSchemas)],
  controllers: [ChallengeController],
  providers: [ChallengeService, S3Service],
  exports: [ChallengeService],
})
export class ChallengeModule {}
