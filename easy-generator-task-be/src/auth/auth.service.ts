import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpInfo } from './dtos/sign-up-info.dto';
import { UsersService } from 'src/users/users.service';
import { SignInInfo } from './dtos/sign-in-info.dto';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserInfo } from 'src/users/dtos/user-info.dto';
import { RefreshTokenRepository } from './auth.refresh-token-repository';
import { Types } from 'mongoose';
import * as crypto from 'crypto';
import { TOKEN_EXPIRATIONS } from './constants/auth.constants';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) {}

    async signUp(signUpInfo: SignUpInfo) {
        const hashedPassword = await bcrypt.hash(signUpInfo.password, 10);
        signUpInfo.password = hashedPassword;
        
        const userInfo: UserInfo = {
            email: signUpInfo.email,
            name: signUpInfo.name,
            password: signUpInfo.password,
        };

        const userId = await this.usersService.createUser(userInfo);
        return this.createTokens(userId.toString());
    }

    async signIn(signInInfo: SignInInfo) {
        const user = await this.usersService.findUser(signInInfo.email);
        if (!user) {
            throw new UnauthorizedException('No user found with this email');
        }

        const isMatch = await bcrypt.compare(signInInfo.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        return this.createTokens(user.id!);
    }

    private async createTokens(userId: string) {
        // Access token
        const tokenPayload: TokenPayload = { userId: userId.toString() };
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        
        // Refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date();
        expiresAt.setTime(expiresAt.getTime() + TOKEN_EXPIRATIONS.REFRESH_TOKEN * 1000); 

        await this.refreshTokenRepository.create({
            token: refreshToken,
            userId: new Types.ObjectId(userId),
            expiresAt,
            isRevoked: false,
        });
        
        return { accessToken, refreshToken };
    }
    
    async refreshAccessToken(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token found in request');
        }

        const tokenDoc = await this.refreshTokenRepository.findByToken(refreshToken);
        
        if (!tokenDoc) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        
        if (new Date() > tokenDoc.expiresAt) {
            throw new UnauthorizedException('Refresh token expired');
        }
        
        const tokenPayload: TokenPayload = { userId: tokenDoc.userId.toString() };
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        
        return { accessToken };
    }

    async logout(refreshToken: string) {
        await this.refreshTokenRepository.revokeToken(refreshToken);
    }
}