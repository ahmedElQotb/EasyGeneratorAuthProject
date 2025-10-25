import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserInfo } from './dtos/user-info.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userData: UserInfo): Promise<User> {
        const createdUser = new this.userModel(userData);
        return await createdUser.save();
  }

  async findUser(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
}

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
