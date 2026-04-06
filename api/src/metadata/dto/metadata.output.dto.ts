import { ApiProperty } from '@nestjs/swagger';

export class FileMetadataDto {
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

export class ListMetadataOutputDto {
  @ApiProperty({ type: [FileMetadataDto] })
  items: FileMetadataDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class GetMetadataOutputDto {
  @ApiProperty()
  file: FileMetadataDto;
}

export class UpdateMetadataOutputDto {
  @ApiProperty()
  file: FileMetadataDto;
}

export class TrashFileOutputDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class RestoreFileOutputDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}