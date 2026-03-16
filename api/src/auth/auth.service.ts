import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../users/users.repository';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { JwtAuthService, TokenPayload } from '../common/jwt/jwt-auth.service';
import { MailService } from '../mail/mail.service.interface';
import {
  RegisterInputDto,
  RegisterCompleteInputDto,
  LoginInputDto,
  LoginCompleteInputDto,
  RefreshInputDto,
  LogoutInputDto,
  Enable2FAInputDto,
  Enable2FACompleteInputDto,
  Disable2FAInputDto,
  Disable2FACompleteInputDto,
  ChangeEmailInputDto,
  ChangeEmailCompleteInputDto,
  ChangePasswordInputDto,
  ChangePasswordCompleteInputDto,
  ChangeMetaInputDto,
  ValidateTokenInputDto,
} from './dto/auth.input.dto';
import {
  RegisterResponseDto,
  AuthTokensResponseDto,
  LoginResponseDto,
  LoginCompleteResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
  MessageResponseDto,
  Enable2FAResponseDto,
  Enable2FACompleteResponseDto,
  Disable2FAResponseDto,
  Disable2FACompleteResponseDto,
  ChangeEmailResponseDto,
  ChangeMetaResponseDto,
  ValidateTokenResponseDto,
} from './dto/auth.response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly cache: RedisCacheService,
    private readonly jwtService: JwtAuthService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  private async generate2FACode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private parseStoredData(data: string): [string, string] | null {
    const idx = data.indexOf(':');
    if (idx === -1) return null;
    return [data.slice(0, idx), data.slice(idx + 1)];
  }

  async register(input: RegisterInputDto): Promise<RegisterResponseDto> {
    const exists = await this.usersRepo.existsByEmail(input.email);
    if (exists) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.usersRepo.create({
      id: uuidv4(),
      email: input.email,
      passwordHash: hashedPassword,
      name: input.name,
      isVerified: false,
      is2FAEnabled: false,
    });

    const code = await this.generate2FACode();
    await this.mailService.send2FACode({
      emailAddress: user.email,
      code,
    });

    await this.cache.set(
      `verify:${user.id}`,
      code,
      5 * 60,
    );

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      message: 'Verification code sent to email',
    };
  }

  async registerComplete(input: RegisterCompleteInputDto): Promise<AuthTokensResponseDto> {
    const storedCode = await this.cache.get(`verify:${input.userId}`);
    if (!storedCode || storedCode !== input.code) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const user = await this.usersRepo.findById(input.userId);
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepo.update(user.id, {
      isVerified: true,
      updatedAt: new Date(),
    });

    await this.cache.del(`verify:${input.userId}`);

    const { accessToken, refreshToken } = await this.jwtService.generateTokenPair(
      user.id,
      user.email,
    );

    const refreshTTL = this.configService.get<number>('jwt.refreshTTL', 604800);
    await this.cache.set(`refresh:${user.id}`, refreshToken, refreshTTL);

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      accessToken,
      accessExpiresIn: 900,
      refreshToken,
      refreshExpiresIn: refreshTTL,
    };
  }

  async login(input: LoginInputDto): Promise<LoginResponseDto> {
    const user = await this.usersRepo.findByEmail(input.email);
    if (!user || !user.checkPassword(input.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.is2FAEnabled || !user.isVerified) {
      const code = await this.generate2FACode();
      await this.mailService.send2FACode({
        emailAddress: user.email,
        code,
      });

      await this.cache.set(`2fa:${user.id}`, code, 5 * 60);

      const tempToken = await this.jwtService.generateTempToken(user.id, user.email);

      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        tempToken,
        requires2FA: true,
        message: '2FA code sent to email',
      };
    }

    const { accessToken, refreshToken } = await this.jwtService.generateTokenPair(
      user.id,
      user.email,
    );

    const refreshTTL = this.configService.get<number>('jwt.refreshTTL', 604800);
    await this.cache.set(`refresh:${user.id}`, refreshToken, refreshTTL);

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      accessToken,
      accessExpiresIn: 900,
      refreshToken,
      refreshExpiresIn: refreshTTL,
      requires2FA: false,
      message: 'Login successful',
    };
  }

  async loginComplete(input: LoginCompleteInputDto): Promise<LoginCompleteResponseDto> {
    const claims = await this.jwtService.validateTempToken(input.tempToken);

    const storedCode = await this.cache.get(`2fa:${claims.userId}`);
    if (!storedCode || storedCode !== input.code) {
      throw new BadRequestException('Invalid 2FA code');
    }

    const user = await this.usersRepo.findById(claims.userId);
    if (!user) throw new NotFoundException('User not found');

    if (!user.isVerified) {
      await this.usersRepo.update(user.id, {
        isVerified: true,
        updatedAt: new Date(),
      });
    }

    const { accessToken, refreshToken } = await this.jwtService.generateTokenPair(
      user.id,
      user.email,
    );

    const refreshTTL = this.configService.get<number>('jwt.refreshTTL', 604800);
    await this.cache.set(`refresh:${user.id}`, refreshToken, refreshTTL);
    await this.cache.del(`2fa:${claims.userId}`);

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      accessToken,
      accessExpiresIn: 900,
      refreshToken,
      refreshExpiresIn: refreshTTL,
    };
  }

  async refresh(input: RefreshInputDto): Promise<RefreshResponseDto> {
    const blacklisted = await this.cache.exists(`blacklist:${input.refreshToken}`);
    if (blacklisted > 0) {
      throw new UnauthorizedException('Refresh token blacklisted');
    }

    const claims = await this.jwtService.validateRefreshToken(input.refreshToken);

    const storedRefresh = await this.cache.get(`refresh:${claims.userId}`);
    if (!storedRefresh || storedRefresh !== input.refreshToken) {
      throw new UnauthorizedException('Refresh token mismatch');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.jwtService.generateTokenPair(claims.userId, claims.email);

    const refreshTTL = this.configService.get<number>('jwt.refreshTTL', 604800);
    await this.cache.set(`refresh:${claims.userId}`, newRefreshToken, refreshTTL);

    return {
      accessToken,
      accessExpiresIn: 900,
      refreshToken: newRefreshToken,
      refreshExpiresIn: refreshTTL,
    };
  }

  async logout(input: LogoutInputDto): Promise<LogoutResponseDto> {
    try {
      const claims = await this.jwtService.validateRefreshToken(input.refreshToken);
      const decoded = this.jwtService.decodeToken(input.refreshToken);
      
      if (decoded && decoded.exp) {
        const expiresAt = new Date(decoded.exp * 1000);
        const ttlSeconds = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));

        if (ttlSeconds > 0) {
          await this.cache.set(`blacklist:${input.refreshToken}`, '1', ttlSeconds);
        }
      }

      await this.cache.del(`refresh:${claims.userId}`);
      return { success: true };
    } catch {
      return { success: true };
    }
  }

  async enable2FA(input: Enable2FAInputDto, userId: string): Promise<Enable2FAResponseDto> {
    const user = await this.usersRepo.findById(userId);
    if (!user || !user.checkPassword(input.password)) {
      throw new UnauthorizedException('Invalid password');
    }

    const code = await this.generate2FACode();
    await this.mailService.send2FACode({
      emailAddress: user.email,
      code,
    });

    await this.cache.set(`enable_2fa:${user.id}`, code, 5 * 60);

    return { message: '2FA code sent to email' };
  }

  async enable2FAComplete(input: Enable2FACompleteInputDto, userId: string): Promise<Enable2FACompleteResponseDto> {
    const storedCode = await this.cache.get(`enable_2fa:${userId}`);
    if (!storedCode || storedCode !== input.code) {
      throw new BadRequestException('Invalid 2FA code');
    }

    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepo.update(user.id, {
      is2FAEnabled: true,
      updatedAt: new Date(),
    });

    await this.cache.del(`enable_2fa:${userId}`);

    return { is2FAEnabled: true, message: '2FA enabled successfully' };
  }

  async disable2FA(input: Disable2FAInputDto, userId: string): Promise<Disable2FAResponseDto> {
    const user = await this.usersRepo.findById(userId);
    if (!user || !user.checkPassword(input.password)) {
      throw new UnauthorizedException('Invalid password');
    }
    if (!user.is2FAEnabled) {
      throw new BadRequestException('2FA is not enabled');
    }

    const code = await this.generate2FACode();
    await this.mailService.send2FACode({
      emailAddress: user.email,
      code,
    });

    await this.cache.set(`disable_2fa:${user.id}`, code, 5 * 60);

    return { message: 'Verification code sent to email' };
  }

  async disable2FAComplete(input: Disable2FACompleteInputDto, userId: string): Promise<Disable2FACompleteResponseDto> {
    const storedCode = await this.cache.get(`disable_2fa:${userId}`);
    if (!storedCode || storedCode !== input.code) {
      throw new BadRequestException('Invalid verification code');
    }

    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepo.update(user.id, {
      is2FAEnabled: false,
      updatedAt: new Date(),
    });

    await this.cache.del(`disable_2fa:${userId}`);

    return { is2FAEnabled: false, message: '2FA disabled successfully' };
  }

  async changeEmail(input: ChangeEmailInputDto, userId: string): Promise<MessageResponseDto> {
    const user = await this.usersRepo.findById(userId);
    if (!user || !user.checkPassword(input.currentPassword)) {
      throw new UnauthorizedException('Invalid password');
    }

    const exists = await this.usersRepo.existsByEmail(input.newEmail);
    if (exists) {
      throw new ConflictException('Email already in use');
    }

    const code = await this.generate2FACode();
    await this.mailService.send2FACode({
      emailAddress: input.newEmail,
      code,
    });

    await this.cache.set(
      `change_email:${user.id}`,
      `${code}:${input.newEmail}`,
      5 * 60,
    );

    return { message: 'Verification code sent to new email' };
  }

  async changeEmailComplete(input: ChangeEmailCompleteInputDto, userId: string): Promise<ChangeEmailResponseDto> {
    const storedData = await this.cache.get(`change_email:${userId}`);
    if (!storedData) {
      throw new BadRequestException('Verification code not found or expired');
    }

    const parsed = this.parseStoredData(storedData);
    if (!parsed || parsed[0] !== input.code) {
      throw new BadRequestException('Invalid verification code');
    }

    const [, newEmail] = parsed;
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.usersRepo.update(user.id, {
      email: newEmail,
      updatedAt: new Date(),
    });

    await this.cache.del(`change_email:${userId}`);
    await this.cache.del(`refresh:${user.id}`);

    return { email: newEmail, message: 'Email changed successfully' };
  }

  async changePassword(input: ChangePasswordInputDto, userId: string): Promise<MessageResponseDto> {
    const user = await this.usersRepo.findById(userId);
    if (!user || !user.checkPassword(input.currentPassword)) {
      throw new UnauthorizedException('Invalid current password');
    }

    const code = await this.generate2FACode();
    await this.mailService.send2FACode({
      emailAddress: user.email,
      code,
    });

    await this.cache.set(
      `change_password:${user.id}`,
      `${code}:${input.newPassword}`,
      5 * 60,
    );

    return { message: 'Verification code sent to email' };
  }

  async changePasswordComplete(input: ChangePasswordCompleteInputDto, userId: string): Promise<MessageResponseDto> {
    const storedData = await this.cache.get(`change_password:${userId}`);
    if (!storedData) {
      throw new BadRequestException('Verification code not found or expired');
    }

    const parsed = this.parseStoredData(storedData);
    if (!parsed || parsed[0] !== input.code) {
      throw new BadRequestException('Invalid verification code');
    }

    const [, newPassword] = parsed;
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersRepo.update(user.id, {
      passwordHash: hashedPassword,
      updatedAt: new Date(),
    });

    await this.cache.del(`change_password:${userId}`);
    await this.cache.del(`refresh:${user.id}`);

    return { message: 'Password changed successfully' };
  }

  async changeMeta(input: ChangeMetaInputDto, userId: string): Promise<ChangeMetaResponseDto> {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.usersRepo.update(user.id, {
      name: input.name,
      updatedAt: new Date(),
    });

    return {
      userId: updated.id,
      name: updated.name,
      message: 'Profile updated successfully',
    };
  }

  async validateToken(input: ValidateTokenInputDto): Promise<ValidateTokenResponseDto> {
    try {
      const claims = await this.jwtService.validateAccessToken(input.token);
      const expiresIn = Math.floor(
        (new Date(claims.exp! * 1000).getTime() - Date.now()) / 1000,
      );

      return {
        valid: true,
        userId: claims.userId,
        email: claims.email,
        expiresIn,
      };
    } catch {
      return { valid: false };
    }
  }
}