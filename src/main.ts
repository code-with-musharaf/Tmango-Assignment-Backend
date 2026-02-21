import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const loggerModule = new Logger();
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT ?? 8080);
  loggerModule.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
