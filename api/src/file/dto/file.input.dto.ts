import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsObject,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitiateUploadInputDto {
  @ApiProperty({ description: 'Original filename' })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ description: 'File path/folder', required: false })
  @IsString()
  @IsOptional()
  path?: string;

  @ApiProperty({ description: 'MIME type', required: false })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiProperty({ description: 'File size in bytes', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  size?: number;

  @ApiProperty({ description: 'Is file public', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({ description: 'File tags', required: false })
  @IsObject()
  @IsOptional()
  tags?: Record<string, string>;
}

export class CompleteUploadInputDto {
  @ApiProperty()
  @IsUUID()
  fileId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  eTag?: string;
}

export class GetDownloadLinkInputDto {
  @ApiProperty({ description: 'Link expiration in seconds', default: 3600, required: false })
  @IsInt()
  @Min(60)
  @IsOptional()
  expiresIn?: number;
}

export class GetFileInfoInputDto {
  @ApiProperty()
  @IsUUID()
  fileId: string;
}