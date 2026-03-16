// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  RegisterInputDto,
  RegisterCompleteInputDto,
  LoginInputDto,
  LoginCompleteInputDto,
  RefreshInputDto,
  LogoutInputDto,
  Enable2FAInputDto,
  Enable2FACompleteInputDto,
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
  ChangeEmailResponseDto,
  ChangeMetaResponseDto,
  ValidateTokenResponseDto,
} from './dto/auth.response.dto';

@ApiTags('auth')
@Controller('api/v2/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, type: RegisterResponseDto })
  async register(@Body() input: RegisterInputDto) {
    return this.authService.register(input);
  }

  @Post('register/complete')
  @ApiOperation({ summary: 'Complete registration with verification code' })
  @ApiResponse({ status: 200, type: AuthTokensResponseDto })
  async registerComplete(@Body() input: RegisterCompleteInputDto) {
    return this.authService.registerComplete(input);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(@Body() input: LoginInputDto) {
    return this.authService.login(input);
  }

  @Post('login/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete login with 2FA code' })
  @ApiResponse({ status: 200, type: LoginCompleteResponseDto })
  async loginComplete(@Body() input: LoginCompleteInputDto) {
    return this.authService.loginComplete(input);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: RefreshResponseDto })
  async refresh(@Body() input: RefreshInputDto) {
    return this.authService.refresh(input);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user (invalidate tokens)' })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  async logout(@Body() input: LogoutInputDto, @Request() req) {
    return this.authService.logout(input);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Enable 2FA for user' })
  @ApiResponse({ status: 200, type: Enable2FAResponseDto })
  async enable2FA(@Body() input: Enable2FAInputDto, @Request() req) {
    return this.authService.enable2FA(input, req.user.userId);
  }

  @Post('2fa/enable/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Complete 2FA enablement' })
  @ApiResponse({ status: 200, type: Enable2FACompleteResponseDto })
  async enable2FAComplete(@Body() input: Enable2FACompleteInputDto, @Request() req) {
    return this.authService.enable2FAComplete(input, req.user.userId);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Disable 2FA for user' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async disable2FA(@Body() input: Enable2FAInputDto, @Request() req) {
    return this.authService.disable2FA(input, req.user.userId);
  }

  @Post('2fa/disable/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Complete 2FA disablement' })
  @ApiResponse({ status: 200, type: Enable2FACompleteResponseDto })
  async disable2FAComplete(@Body() input: Enable2FACompleteInputDto, @Request() req) {
    return this.authService.disable2FAComplete(input, req.user.userId);
  }

  @Post('email/change')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Request email change' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async changeEmail(@Body() input: ChangeEmailInputDto, @Request() req) {
    return this.authService.changeEmail(input, req.user.userId);
  }

  @Post('email/change/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Complete email change' })
  @ApiResponse({ status: 200, type: ChangeEmailResponseDto })
  async changeEmailComplete(@Body() input: ChangeEmailCompleteInputDto, @Request() req) {
    return this.authService.changeEmailComplete(input, req.user.userId);
  }

  @Post('password/change')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Request password change' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async changePassword(@Body() input: ChangePasswordInputDto, @Request() req) {
    return this.authService.changePassword(input, req.user.userId);
  }

  @Post('password/change/complete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Complete password change' })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  async changePasswordComplete(@Body() input: ChangePasswordCompleteInputDto, @Request() req) {
    return this.authService.changePasswordComplete(input, req.user.userId);
  }

  @Post('meta/change')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change user metadata (name)' })
  @ApiResponse({ status: 200, type: ChangeMetaResponseDto })
  async changeMeta(@Body() input: ChangeMetaInputDto, @Request() req) {
    return this.authService.changeMeta(input, req.user.userId);
  }

  @Post('token/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate access token' })
  @ApiResponse({ status: 200, type: ValidateTokenResponseDto })
  async validateToken(@Body() input: ValidateTokenInputDto) {
    return this.authService.validateToken(input);
  }
}