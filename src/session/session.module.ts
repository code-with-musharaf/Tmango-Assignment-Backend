import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseSchemas } from 'src/database/schema';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [MongooseModule.forFeature(DatabaseSchemas)],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
