import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserInfo } from './dtos/user-info.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(userInfo: UserInfo): Promise<string> {
        try {
            return await this.usersRepository.create(userInfo);
          } catch (error) {
            this.logger.error(`Failed to create user: ${error}`);   
            if (error.code === 11000) {
              throw new ConflictException('User with this email already registered');
            }

            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async findUser(email: string): Promise<UserInfo | null> {
        this.logger.log(`Finding user by email: ${email}`);
        const user = await this.usersRepository.findUser(email);
        if (!user) {
            this.logger.warn(`User not found with email: ${email}`);
            return null;
        }
        this.logger.log(`User found: ${user.email}`);
        return user;
    }  

    async findUserById(id: string): Promise<UserInfo | null> {
        const user = await this.usersRepository.findUserById(id);
        if (!user) {
            this.logger.warn(`User not found with id: ${id}`);
            throw new UnauthorizedException('No user found with this id');
        }
        this.logger.log(`User found: ${user.email}`);
        return user;
    }
}
