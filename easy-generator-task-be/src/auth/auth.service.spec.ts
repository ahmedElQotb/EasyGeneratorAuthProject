import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenRepository } from './auth.refresh-token-repository';
import { SignUpInfo } from './dtos/sign-up-info.dto';
import { SignInInfo } from './dtos/sign-in-info.dto';
import { Types } from 'mongoose';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;

  const mockUsersService = {
    createUser: jest.fn(),
    findUser: jest.fn(),
    findUserById: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockRefreshTokenRepository = {
    create: jest.fn(),
    findByToken: jest.fn(),
    revokeToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RefreshTokenRepository,
          useValue: mockRefreshTokenRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    refreshTokenRepository = module.get(RefreshTokenRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a user and return tokens', async () => {
      const signUpInfo: SignUpInfo = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };

      const userId = new Types.ObjectId();
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      usersService.createUser.mockResolvedValue(userId as any);
      jwtService.signAsync.mockResolvedValue('accessToken');
      refreshTokenRepository.create.mockResolvedValue({} as any);

      const result = await service.signUp(signUpInfo);

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(usersService.createUser).toHaveBeenCalledWith({
        email: 'john@example.com',
        name: 'John Doe',
        password: hashedPassword,
      });
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(refreshTokenRepository.create).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('signIn', () => {
    it('should return tokens for valid credentials', async () => {
      const signInInfo: SignInInfo = {
        email: 'john@example.com',
        password: 'Password123!',
      };

      const user = {
        id: new Types.ObjectId(),
        email: 'john@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      };

      usersService.findUser.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('accessToken');
      refreshTokenRepository.create.mockResolvedValue({} as any);

      const result = await service.signIn(signInInfo);

      expect(usersService.findUser).toHaveBeenCalledWith('john@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const signInInfo: SignInInfo = {
        email: 'john@example.com',
        password: 'Password123!',
      };

      usersService.findUser.mockResolvedValue(null);

      await expect(service.signIn(signInInfo)).rejects.toThrow(
        new UnauthorizedException('No user found with this email'),
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const signInInfo: SignInInfo = {
        email: 'john@example.com',
        password: 'WrongPassword!',
      };

      const user = {
        id: new Types.ObjectId(),
        email: 'john@example.com',
        password: 'hashedPassword',
        name: 'John Doe',
      };

      usersService.findUser.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInInfo)).rejects.toThrow(
        new UnauthorizedException('Invalid password'),
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should return new access token for valid refresh token', async () => {
      const refreshToken = 'validRefreshToken';
      const userId = new Types.ObjectId();
      const tokenDoc = {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 1000000),
        isRevoked: false,
      };

      refreshTokenRepository.findByToken.mockResolvedValue(tokenDoc as any);
      jwtService.signAsync.mockResolvedValue('newAccessToken');

      const result = await service.refreshAccessToken(refreshToken);

      expect(refreshTokenRepository.findByToken).toHaveBeenCalledWith(refreshToken);
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({ accessToken: 'newAccessToken' });
    });

    it('should throw UnauthorizedException when refresh token is missing', async () => {
      await expect(service.refreshAccessToken('')).rejects.toThrow(
        new UnauthorizedException('No refresh token found in request'),
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      refreshTokenRepository.findByToken.mockResolvedValue(null);

      await expect(service.refreshAccessToken('invalidToken')).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token'),
      );
    });

    it('should throw UnauthorizedException when refresh token is expired', async () => {
      const refreshToken = 'expiredToken';
      const tokenDoc = {
        token: refreshToken,
        userId: new Types.ObjectId(),
        expiresAt: new Date(Date.now() - 1000), // Expired
        isRevoked: false,
      };

      refreshTokenRepository.findByToken.mockResolvedValue(tokenDoc as any);

      await expect(service.refreshAccessToken(refreshToken)).rejects.toThrow(
        new UnauthorizedException('Refresh token expired'),
      );
    });
  });

  describe('logout', () => {
    it('should revoke the refresh token', async () => {
      const refreshToken = 'tokenToRevoke';

      await service.logout(refreshToken);

      expect(refreshTokenRepository.revokeToken).toHaveBeenCalledWith(refreshToken);
    });
  });
});
