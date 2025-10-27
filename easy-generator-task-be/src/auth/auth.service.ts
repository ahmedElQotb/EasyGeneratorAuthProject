import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
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
import { TokenResponse } from './dtos/token-response.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenRepository: RefreshTokenRepository
    ) {}

    async signUp(signUpInfo: SignUpInfo) : Promise<TokenResponse> {
        this.logger.log(`📝 Sign up attempt: ${signUpInfo.email}`);
        
        const hashedPassword = await bcrypt.hash(signUpInfo.password, 10);
        signUpInfo.password = hashedPassword;
        
        const userInfo: UserInfo = {
            email: signUpInfo.email,
            name: signUpInfo.name,
            password: signUpInfo.password,
        };

        const userId = await this.usersService.createUser(userInfo);
        this.logger.log(`User created successfully: ${userId}`);
        
        return await this.createTokens(userId.toString());
    }

    async signIn(signInInfo: SignInInfo) : Promise<TokenResponse> {
        this.logger.log(`Sign in attempt: ${signInInfo.email}`);
        
        const user = await this.usersService.findUser(signInInfo.email);
        if (!user) {
            this.logger.warn(`Sign in failed: User not found - ${signInInfo.email}`);
            throw new UnauthorizedException('No user found with this email');
        }

        const isMatch = await bcrypt.compare(signInInfo.password, user.password);
        if (!isMatch) {
            this.logger.warn(`Sign in failed: Invalid password - ${signInInfo.email}`);
            throw new UnauthorizedException('Invalid password');
        }

        this.logger.log(`Sign in successful: ${signInInfo.email}`);
        return await this.createTokens(user.id!);
    }

    private async createTokens(userId: string) : Promise<TokenResponse> {
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
            this.logger.warn('Refresh attempt with no token');
            throw new UnauthorizedException('No refresh token found in request');
        }

        const tokenDoc = await this.refreshTokenRepository.findByToken(refreshToken);
        
        if (!tokenDoc) {
            this.logger.warn('Invalid refresh token attempt');
            throw new UnauthorizedException('Invalid refresh token');
        }
        
        if (new Date() > tokenDoc.expiresAt) {
            this.logger.warn(`Expired refresh token: ${tokenDoc.userId}`);
            throw new UnauthorizedException('Refresh token expired');
        }
        
        this.logger.log(`Token refreshed for user: ${tokenDoc.userId}`);
        
        const tokenPayload: TokenPayload = { userId: tokenDoc.userId.toString() };
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        
        return { accessToken };
    }

    async logout(refreshToken: string) {
        this.logger.log('Logout request received');
        await this.refreshTokenRepository.revokeToken(refreshToken);
        this.logger.log('Logout successful');
    }
}