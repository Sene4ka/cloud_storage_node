import { IsEmail, IsString, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInputDto {
  @ApiProperty() @IsEmail()
  @Field() email: string;

  @ApiProperty() @IsString() @MinLength(8) @MaxLength(128)
  @Field() password: string;

  @ApiProperty() @IsString() @MinLength(1) @MaxLength(100)
  @Field() name: string;
}

@InputType()
export class RegisterCompleteInputDto {
  @ApiProperty() @IsUUID()
  @Field() userId: string;

  @ApiProperty() @IsString() @MinLength(6) @MaxLength(6)
  @Field() code: string;
}

@InputType()
export class LoginInputDto {
  @ApiProperty() @IsEmail()
  @Field() email: string;

  @ApiProperty() @IsString()
  @Field() password: string;
}

@InputType()
export class LoginCompleteInputDto {
  @ApiProperty() @IsString()
  @Field() tempToken: string;

  @ApiProperty() @IsString() @MinLength(6) @MaxLength(6)
  @Field() code: string;
}

@InputType()
export class RefreshInputDto {
  @ApiProperty() @IsString()
  @Field() refreshToken: string;
}

@InputType()
export class LogoutInputDto {
  @ApiProperty() @IsString()
  @Field() refreshToken: string;
}

@InputType()
export class Enable2FAInputDto {
  @ApiProperty() @IsString() @MinLength(1)
  @Field() password: string;
}

@InputType()
export class Enable2FACompleteInputDto {
  @ApiProperty() @IsString() @MinLength(6) @MaxLength(6)
  @Field() code: string;
}

export class Disable2FAInputDto {
  @ApiProperty({ description: 'Current password for verification' }) @IsString() @MinLength(1)
  @Field() password: string;
}

export class Disable2FACompleteInputDto {
  @ApiProperty({ example: '123456', description: '2FA verification code', minLength: 6, maxLength: 6 }) @IsString() @MinLength(6) @MaxLength(6)
  @Field() code: string;
}

@InputType()
export class ChangeEmailInputDto {
  @ApiProperty() @IsString() @MinLength(1)
  @Field() currentPassword: string;

  @ApiProperty() @IsEmail()
  @Field() newEmail: string;
}

@InputType()
export class ChangeEmailCompleteInputDto {
  @ApiProperty() @IsString() @MinLength(6) @MaxLength(6)
  @Field() code: string;
}

@InputType()
export class ChangePasswordInputDto {
  @ApiProperty() @IsString() @MinLength(1)
  @Field() currentPassword: string;

  @ApiProperty() @IsString() @MinLength(8) @MaxLength(128)
  @Field() newPassword: string;
}

@InputType()
export class ChangePasswordCompleteInputDto {
  @ApiProperty() @IsString() @MinLength(6) @MaxLength(6)
  @Field() code: string;
}

@InputType()
export class ChangeMetaInputDto {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(100)
  @Field() name: string;
}

@InputType()
export class ValidateTokenInputDto {
  @ApiProperty() @IsString()
  @Field() token: string;
}