import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/database/schema/user.schema";

@Injectable()
export class AuthService {
  constructor(@InjectModel("User") private userModel: Model<User>) {}

  async login(data: {
    name: string;
    email: string;
  }): Promise<{ token: string; user: User }> {
    try {
      const { name = "", email = "" } = data;
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        return { token: existingUser._id.toString(), user: existingUser };
      }
      const newUser = await this.userModel.create({ name, email });
      return { token: newUser._id.toString(), user: newUser };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
