import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session } from 'src/database/schema/session.schema';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionService {
  constructor(@InjectModel('Session') private sessionModel: Model<Session>) {}

  async createSession(session: CreateSessionDto): Promise<Session> {
    const createdSession = new this.sessionModel(session);
    return createdSession.save();
  }

  async getAllSessions(): Promise<Session[]> {
    const allSessions = await this.sessionModel.aggregate([
      {
        $sort: {
          startTime: -1,
        },
      },
    ]);
    return allSessions;
  }

  async getSessionById(id: string): Promise<Session | null> {
    return await this.sessionModel.findById(id).exec();
  }
}
