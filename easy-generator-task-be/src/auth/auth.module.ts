import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenRepository } from './auth.refresh-token-repository';
import { RefreshToken, RefreshTokenSchema } from './schema/refresh-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TOKEN_EXPIRATIONS } from './constants/auth.constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    MongooseModule.forFeature([
      { 
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: TOKEN_EXPIRATIONS.ACCESS_TOKEN,
        },
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenRepository],
})
export class AuthModule {}