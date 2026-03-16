import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export type TokenPayload = {
  userId: string;
  email: string;
  type: 'access' | 'refresh' | 'temp';
  exp?: number;
  iat?: number;
  jti?: string;
};

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private get secret(): string {
    return this.configService.getOrThrow<string>('JWT_SECRET');
  }

  async generateTokenPair(userId: string, email: string) {
    const accessToken = await this.signToken(
      {
        userId,
        email,
        type: 'access',
      },
      this.configService.get<string>('JWT_ACCESS_TTL', '15m') as string,
    );

    const refreshToken = await this.signToken(
      {
        userId,
        email,
        type: 'refresh',
      },
      this.configService.get<string>('JWT_REFRESH_TTL', '168h') as string,
    );

    return { accessToken, refreshToken };
  }

  async generateTempToken(userId: string, email: string) {
    return this.signToken(
      {
        userId,
        email,
        type: 'temp',
      },
      '5m',
    );
  }

  private async signToken(payload: TokenPayload, ttl: string) {
    return this.jwtService.signAsync(payload as any, {
      secret: this.secret,
      expiresIn: ttl as any,
    } as any);
  }

  async validateAccessToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.secret,
      });

      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type: expected access');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async validateRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.secret,
      });

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type: expected refresh');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateTempToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.secret,
      });

      if (payload.type !== 'temp') {
        throw new UnauthorizedException('Invalid token type: expected temp');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired temp token');
    }
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return this.jwtService.decode<TokenPayload>(token);
    } catch {
      return null;
    }
  }
}