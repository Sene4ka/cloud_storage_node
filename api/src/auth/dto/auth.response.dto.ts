import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;
}

export class AuthTokensResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessExpiresIn: number;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshExpiresIn: number;
}

export class LoginResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  accessToken?: string;

  @ApiProperty({ required: false })
  accessExpiresIn?: number;

  @ApiProperty({ required: false })
  refreshToken?: string;

  @ApiProperty({ required: false })
  refreshExpiresIn?: number;

  @ApiProperty({ required: false })
  tempToken?: string;

  @ApiProperty()
  requires2FA: boolean;

  @ApiProperty()
  message: string;
}

export class LoginCompleteResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessExpiresIn: number;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshExpiresIn: number;
}

export class RefreshResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessExpiresIn: number;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  refreshExpiresIn: number;
}

export class LogoutResponseDto {
  @ApiProperty()
  success: boolean;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;
}

export class Enable2FAResponseDto {
  @ApiProperty()
  message: string;
}

export class Enable2FACompleteResponseDto {
  @ApiProperty()
  is2FAEnabled: boolean;

  @ApiProperty()
  message: string;
}

export class Disable2FAResponseDto {
  @ApiProperty()
  message: string;
}

export class Disable2FACompleteResponseDto {
  @ApiProperty()
  is2FAEnabled: boolean;

  @ApiProperty()
  message: string;
}

export class ChangeEmailResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;
}

export class ChangeMetaResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;
}

export class ValidateTokenResponseDto {
  @ApiProperty()
  valid: boolean;

  @ApiProperty({ required: false })
  userId?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  expiresIn?: number;
}