import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserInfo } from './dtos/user-info.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userData: UserInfo): Promise<string> {
        const createdUser = new this.userModel(userData);
        const user = await createdUser.save();
        return user._id.toString();
  }

  async findUser(email: string): Promise<UserInfo | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return this.mapToUserInfo(user);
  }

  async findUserById(id: string): Promise<UserInfo | null> {
    const user = await this.userModel.findById(id).exec();
    return this.mapToUserInfo(user);
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  private mapToUserInfo(user: User | null): UserInfo | null {
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      password: user.password,
    };
  }
}
