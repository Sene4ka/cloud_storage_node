import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthService } from '../common/jwt/jwt-auth.service';
import { UsersRepository } from '../users/users.repository';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MailModule } from '../mail/mail.module';
import {AuthResolver} from "./auth.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthResolver,
    JwtAuthService,
    UsersRepository,
    RedisCacheService,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}