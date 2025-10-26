import { Controller, Post, Body, HttpCode, HttpStatus, Res, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpInfo } from './dtos/sign-up-info.dto';
import { SignInInfo } from './dtos/sign-in-info.dto';
import type { Response } from 'express';
import type { Request } from 'express';
import { COOKIE_NAMES, TOKEN_EXPIRATIONS } from './constants/auth.constants';
import { ConfigService } from '@nestjs/config';
import { AuthResponseMessage } from './dtos/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Post('signUp')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Sign up a new user' })
    @ApiResponse({ status: 201, description: 'User successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 409, description: 'Conflict - email already exists' })
    async signUp(@Body() signUpInfo: SignUpInfo, @Res({ passthrough: true }) response: Response): Promise<AuthResponseMessage> {
        const { accessToken, refreshToken } = await this.authService.signUp(signUpInfo);
        this.setCookies(response, accessToken, refreshToken);
        return { message: 'Sign up successful' };
    } 

    @Post('signIn')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Sign in an existing user' })
    @ApiResponse({ status: 200, description: 'User successfully signed in' })
    @ApiResponse({ status: 401, description: 'Unauthorized - invalid credentials' })
    async signIn(@Body() signInInfo: SignInInfo, @Res({ passthrough: true }) response: Response): Promise<AuthResponseMessage> {
        const { accessToken, refreshToken } = await this.authService.signIn(signInInfo);
        this.setCookies(response, accessToken, refreshToken);
        return { message: 'Sign in successful' };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
    @ApiResponse({ status: 401, description: 'Unauthorized - invalid or expired refresh token' })
    async refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AuthResponseMessage> {
        const refreshToken = request.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];
        const { accessToken } = await this.authService.refreshAccessToken(refreshToken);
        this.setAccessTokenCookie(response, accessToken);
        return { message: 'Access token refreshed' };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'User successfully logged out' })
    async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AuthResponseMessage> {
        const refreshToken = request.cookies?.[COOKIE_NAMES.REFRESH_TOKEN];
        await this.authService.logout(refreshToken);
        this.clearCookies(response);
        return { message: 'Logged out successfully' };
    }

    private setCookies(response: Response, accessToken: string, refreshToken: string) {
        this.setAccessTokenCookie(response, accessToken);
        this.setRefreshTokenCookie(response, refreshToken);
    }

    private setAccessTokenCookie(response: Response, accessToken: string) {
        response.cookie(COOKIE_NAMES.AUTHENTICATION, accessToken, {
            httpOnly: true,
            maxAge: TOKEN_EXPIRATIONS.ACCESS_TOKEN * 1000,
        });
    }

    private setRefreshTokenCookie(response: Response, refreshToken: string) {
        response.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
            httpOnly: true,
            maxAge: TOKEN_EXPIRATIONS.REFRESH_TOKEN * 1000,
        });
    }

    private clearCookies(response: Response) {
        response.clearCookie(COOKIE_NAMES.AUTHENTICATION, { httpOnly: true });
        response.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { httpOnly: true });
    }
}