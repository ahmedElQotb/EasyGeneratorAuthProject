import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpInfo } from './dtos/sign-up-info.dto';
import { UsersService } from 'src/users/users.service';
import { SignInInfo } from './dtos/sign-in-info.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService) {}

    async signUp(signUpInfo: SignUpInfo) {
        const hashedPassword = await bcrypt.hash(signUpInfo.password, 10);
        signUpInfo.password = hashedPassword;
        return this.usersService.createUser(signUpInfo);
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

        
    }
}