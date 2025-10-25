import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schema/user.schema';
import { UserInfo } from './dtos/user-info.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(userInfo: UserInfo): Promise<User> {
        try {
            return await this.usersRepository.create(userInfo);
          } catch (error) {
            
            if (error.code === 11000) {
              throw new ConflictException('User with this email already registered');
            }

            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async findUser(email: string): Promise<User | null> {
        return await this.usersRepository.findUser(email);
    }  

    async findUserById(id: string): Promise<User | null> {
        const user = await this.usersRepository.findUserById(id);
        if (!user) {
            throw new UnauthorizedException('No user found with this id');
        }
        return user;
    }
}
