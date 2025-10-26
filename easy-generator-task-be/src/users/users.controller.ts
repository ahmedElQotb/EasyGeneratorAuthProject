import { Controller, Req, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserInfo } from './dtos/user-info.dto';

@Controller('users')
export class UsersController {

    @Get('username')
    @UseGuards(JwtAuthGuard)
    async getUsername(@CurrentUser() user: UserInfo) {
        return { name : user.name}
    }
}
