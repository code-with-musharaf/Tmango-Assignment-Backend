import { Injectable, BadRequestException } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadBase64(base64: string, type: "image" | "video"): Promise<string> {
    if (!base64) {
      throw new BadRequestException("Base64 data is required");
    }

    const matches = base64.match(/^data:(.+);base64,(.+)$/);

    if (!matches) {
      throw new BadRequestException("Invalid base64 format");
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    // Validate type
    if (type === "image" && !mimeType.startsWith("image/")) {
      throw new BadRequestException("Only image base64 allowed");
    }

    if (type === "video" && !mimeType.startsWith("video/")) {
      throw new BadRequestException("Only video base64 allowed");
    }

    const buffer = Buffer.from(base64Data, "base64");

    const extension = mimeType.split("/")[1];
    const fileName = `${type}/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  }
}
