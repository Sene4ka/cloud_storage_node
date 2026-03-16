import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { FilesRepository } from '../files/files.repository';
import { File } from '../files/entities/file.entity';
import {
  ListMetadataInputDto,
  UpdateMetadataInputDto,
} from './dto/metadata.input.dto';
import {
  ListMetadataOutputDto,
  GetMetadataOutputDto,
  UpdateMetadataOutputDto,
  TrashFileOutputDto,
  RestoreFileOutputDto,
  FileMetadataDto,
} from './dto/metadata.output.dto';

@Injectable()
export class MetadataService {
  private readonly logger = new Logger(MetadataService.name);

  constructor(private readonly filesRepo: FilesRepository) {}

  async listMetadata(
    userId: string,
    options: ListMetadataInputDto,
  ): Promise<ListMetadataOutputDto> {
    const { page = 1, pageSize = 20, sortBy, sortOrder, search, isTrashed } = options;

    const result = await this.filesRepo.listByUser({
      userId,
      page,
      pageSize,
      sortBy,
      sortOrder,
      search,
      isTrashed,
    });

    const totalPages = Math.ceil(result.total / pageSize);

    return {
      items: result.files.map((file) => this.mapToFileMetadataDto(file)),
      total: result.total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getMetadata(fileId: string, userId: string): Promise<GetMetadataOutputDto> {
    const file = await this.filesRepo.findByIdOrFail(fileId);

    if (file.userId !== userId && !file.isPublic) {
      throw new ForbiddenException('Access denied');
    }

    return {
      file: this.mapToFileMetadataDto(file),
    };
  }

  async updateMetadata(
    fileId: string,
    input: UpdateMetadataInputDto,
    userId: string,
  ): Promise<UpdateMetadataOutputDto> {
    const existing = await this.filesRepo.findByIdAndUserOrFail(fileId, userId);

    const updated = await this.filesRepo.update(fileId, userId, {
      filename: input.filename,
      originalName: input.originalName,
      path: input.path,
      isPublic: input.isPublic,
      tags: input.tags,
    });

    this.logger.log(`Metadata updated for file ${fileId}`);

    return {
      file: this.mapToFileMetadataDto(updated),
    };
  }

  async trashFile(fileId: string, userId: string): Promise<TrashFileOutputDto> {
    await this.filesRepo.findByIdAndUserOrFail(fileId, userId);
    await this.filesRepo.setTrashed(fileId, userId, true);

    this.logger.log(`File ${fileId} moved to trash`);

    return {
      success: true,
      message: 'File moved to trash',
    };
  }

  async restoreFile(fileId: string, userId: string): Promise<RestoreFileOutputDto> {
    await this.filesRepo.findByIdAndUserOrFail(fileId, userId);
    await this.filesRepo.setTrashed(fileId, userId, false);

    this.logger.log(`File ${fileId} restored from trash`);

    return {
      success: true,
      message: 'File restored from trash',
    };
  }

  async checkAccess(fileId: string, userId: string): Promise<{
    hasAccess: boolean;
    storagePath?: string;
    bucket?: string;
  }> {
    return this.filesRepo.checkAccess(fileId, userId);
  }

  async deleteMetadata(fileId: string, userId: string): Promise<void> {
    await this.filesRepo.delete(fileId, userId);
    this.logger.log(`File metadata ${fileId} deleted`);
  }

  private mapToFileMetadataDto(file: File): FileMetadataDto {
    return {
      id: file.id,
      userId: file.userId,
      filename: file.filename,
      originalName: file.originalName,
      path: file.path,
      size: file.size,
      mimeType: file.mimeType,
      storagePath: file.storagePath,
      bucket: file.bucket,
      isPublic: file.isPublic,
      tags: file.tags || undefined,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      isTrashed: file.isTrashed,
      trashedAt: file.trashedAt,
    };
  }
}