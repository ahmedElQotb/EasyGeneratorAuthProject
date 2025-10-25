import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpInfo } from './dtos/sign-up-info.dto';
import { SignInInfo } from './dtos/sign-in-info.dto';
import type { Response } from 'express';
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('signUp')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() signUpInfo: SignUpInfo, @Res({ passthrough: true }) response: Response) {
    return this.authService.signUp(signUpInfo, response);
  } 

    @Post('signIn')
    @HttpCode(HttpStatus.CREATED)
    async signIn(@Body() signInInfo: SignInInfo, @Res({ passthrough: true }) response: Response) {
    return this.authService.signIn(signInInfo, response);
  }
}
