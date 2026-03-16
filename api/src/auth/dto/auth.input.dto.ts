import { IsEmail, IsString, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterInputDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}

export class RegisterCompleteInputDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: '123456', description: 'Verification code', minLength: 6, maxLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class LoginInputDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  password: string;
}

export class LoginCompleteInputDto {
  @ApiProperty({ description: 'Temporary token from login response' })
  @IsString()
  tempToken: string;

  @ApiProperty({ example: '123456', description: '2FA verification code', minLength: 6, maxLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class RefreshInputDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;
}

export class LogoutInputDto {
  @ApiProperty({ description: 'Refresh token to invalidate' })
  @IsString()
  refreshToken: string;
}

export class Enable2FAInputDto {
  @ApiProperty({ description: 'Current password for verification' })
  @IsString()
  @MinLength(1)
  password: string;
}

export class Enable2FACompleteInputDto {
  @ApiProperty({ example: '123456', description: '2FA verification code', minLength: 6, maxLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class Disable2FAInputDto {
  @ApiProperty({ description: 'Current password for verification' })
  @IsString()
  @MinLength(1)
  password: string;
}

export class Disable2FACompleteInputDto {
  @ApiProperty({ example: '123456', description: '2FA verification code', minLength: 6, maxLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ChangeEmailInputDto {
  @ApiProperty({ description: 'Current password for verification' })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({ example: 'newemail@example.com', description: 'New email address' })
  @IsEmail()
  newEmail: string;
}

export class ChangeEmailCompleteInputDto {
  @ApiProperty({ example: '123456', description: 'Verification code', minLength: 6, maxLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ChangePasswordInputDto {
  @ApiProperty({ description: 'Current password for verification' })
  @IsString()
  @MinLength(1)
  currentPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}

export class ChangePasswordCompleteInputDto {
  @ApiProperty({ example: '123456', description: 'Verification code', minLength: 6, maxLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class ChangeMetaInputDto {
  @ApiProperty({ example: 'John Doe Updated', description: 'New user name' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}

export class ValidateTokenInputDto {
  @ApiProperty({ description: 'Access token to validate' })
  @IsString()
  token: string;
}