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