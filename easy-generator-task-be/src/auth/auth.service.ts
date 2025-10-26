import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpInfo } from './dtos/sign-up-info.dto';
import { UsersService } from 'src/users/users.service';
import { SignInInfo } from './dtos/sign-in-info.dto';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from 'src/users/dtos/user-info.dto';
import { RefreshTokenRepository } from './auth.refresh-token-repository';
import { Types } from 'mongoose';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) {}

    async signUp(signUpInfo: SignUpInfo, response: Response) {
        const hashedPassword = await bcrypt.hash(signUpInfo.password, 10);
        signUpInfo.password = hashedPassword;
        
        const userInfo: UserInfo = {
            email: signUpInfo.email,
            name: signUpInfo.name,
            password: signUpInfo.password,
        };

        const userId = await this.usersService.createUser(userInfo);
        await this.createTokens(userId.toString(), response);
    }

    async signIn(signInInfo: SignInInfo, response: Response) {
        const user = await this.usersService.findUser(signInInfo.email);
        if (!user) {
            throw new UnauthorizedException('No user found with this email');
        }

        const isMatch = await bcrypt.compare(signInInfo.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        await this.createTokens(user.id!, response);
    }

    private async createTokens(userId: string, response: Response) {
        // Access token
        const tokenPayload: TokenPayload = { userId: userId.toString() };
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        
        // Refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        
        await this.refreshTokenRepository.create({
            token: refreshToken,
            userId: new Types.ObjectId(userId),
            expiresAt,
            isRevoked: false,
        });
        
        // Set cookies
        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            maxAge: this.configService.getOrThrow<number>('jwt.accessTokenExpiration'),
        });
        
        response.cookie('RefreshToken', refreshToken, {
            httpOnly: true,
            maxAge: this.configService.getOrThrow<number>('jwt.refreshTokenExpiration'),
        });
    }
    
    async refreshAccessToken(refreshToken: string, response: Response) {
        const tokenDoc = await this.refreshTokenRepository.findByToken(refreshToken);
        
        if (!tokenDoc) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        
        if (new Date() > tokenDoc.expiresAt) {
            throw new UnauthorizedException('Refresh token expired');
        }
        
        // Generate new access token
        const tokenPayload: TokenPayload = { userId: tokenDoc.userId.toString() };
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        
        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            maxAge: this.configService.getOrThrow<number>('jwt.accessTokenExpiration'),
        });
        
        return { message: 'Access token refreshed' };
    }

    async logout(refreshToken: string) {
        await this.refreshTokenRepository.revokeToken(refreshToken);
        return { message: 'Logged out successfully' };
    }
}