import { ApiProperty } from '@nestjs/swagger';

export class InitiateUploadOutputDto {
  @ApiProperty()
  fileId: string;

  @ApiProperty()
  uploadURL: string;

  @ApiProperty()
  uploadMethod: string;

  @ApiProperty()
  headers: Record<string, string>;

  @ApiProperty()
  expiresIn: number;
}

export class CompleteUploadOutputDto {
  @ApiProperty()
  storagePath: string;

  @ApiProperty()
  createdAt: Date;
}

export class GetDownloadLinkOutputDto {
  @ApiProperty()
  downloadURL: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  headers: Record<string, string>;

  @ApiProperty()
  expiresIn: number;
}

export class DeleteFileOutputDto {
  @ApiProperty()
  success: boolean;
}

export class GetFileInfoOutputDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  mimeType: string;

  @ApiProperty()
  storagePath: string;

  @ApiProperty()
  bucket: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty({ required: false })
  tags?: Record<string, string>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  isTrashed: boolean;

  @ApiProperty({ required: false })
  trashedAt?: Date | null;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;
}