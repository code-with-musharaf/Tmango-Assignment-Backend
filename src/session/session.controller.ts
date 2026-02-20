import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Session } from 'src/database/schema/session.schema';
import { SessionService } from './session.service';

@Controller('/api/session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async createSession(@Body() session: any): Promise<Session> {
    return this.sessionService.createSession(session);
  }

  @Get()
  async getAllSessions(): Promise<Session[]> {
    console.log('Rendering - - - -');
    return this.sessionService.getAllSessions();
  }

  @Get(':id')
  async getSessionById(@Param('id') id: string): Promise<Session | null> {
    return this.sessionService.getSessionById(id);
  }
}
