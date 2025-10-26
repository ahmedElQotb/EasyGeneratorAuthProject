import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from './schema/refresh-token.schema';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
  ) {}

  async create(refreshTokenData: Partial<RefreshToken>): Promise<RefreshToken> {
    const token = new this.refreshTokenModel(refreshTokenData);
    return token.save();
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel
      .findOne({ token, isRevoked: false })
      .exec();
  }

  async revokeToken(token: string): Promise<void> {
    await this.refreshTokenModel.updateOne({ token }, { isRevoked: true });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenModel.updateMany(
      { userId },
      { isRevoked: true },
    );
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokenModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }
}