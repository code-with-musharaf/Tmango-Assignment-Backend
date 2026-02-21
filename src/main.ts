import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import express from "express";

async function bootstrap() {
  const loggerModule = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  await app.listen(process.env.PORT ?? 8080);
  loggerModule.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
