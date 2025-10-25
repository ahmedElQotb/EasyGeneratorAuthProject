import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpInfo } from './dtos/sign-up-info.dto';
import { UsersService } from 'src/users/users.service';
import { SignInInfo } from './dtos/sign-in-info.dto';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async signUp(signUpInfo: SignUpInfo, response: Response) {
        const hashedPassword = await bcrypt.hash(signUpInfo.password, 10);
        signUpInfo.password = hashedPassword;
        const user = await this.usersService.createUser(signUpInfo);
        await this.createAccessTokenCookie(user._id.toString(), response);
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

        await this.createAccessTokenCookie(user._id.toString(), response);
    }

    async createAccessTokenCookie(userId: string, response: Response) {
        const tokenPayload: TokenPayload = { userId };
        const accessToken = await this.jwtService.signAsync(tokenPayload);
        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + this.configService.getOrThrow<number>('jwt.accessTokenExpiration')*1000),
        });
    }
}