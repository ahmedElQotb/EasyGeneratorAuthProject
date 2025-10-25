import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(user: User): Promise<User> {
        try {
            return await this.usersRepository.create(user);
          } catch (error) {
            
            if (error.code === 11000) {
              throw new ConflictException('User already registered');
            }

            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async findUser(email: string): Promise<User | null> {
        return await this.usersRepository.findUser(email);
    }  
}
