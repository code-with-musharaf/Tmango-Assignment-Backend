import { Body, Controller, Post } from "@nestjs/common";
import { User } from "src/database/schema/user.schema";
import { AuthService } from "./auth.service";

@Controller("/api/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() data: any): Promise<{ token: string; user: User }> {
    return this.authService.login(data);
  }
}
