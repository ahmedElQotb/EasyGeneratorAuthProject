import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpInfo } from './dtos/sign-up-info.dto';
import { SignInInfo } from './dtos/sign-in-info.dto';
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('signUp')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() signUpInfo: SignUpInfo) {
    return this.authService.signUp(signUpInfo);
  } 

    @Post('signIn')
    @HttpCode(HttpStatus.CREATED)
    async signIn(@Body() signInInfo: SignInInfo) {
    return this.authService.signIn(signInInfo);
  }
}
