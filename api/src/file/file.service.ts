import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesRepository } from '../files/files.repository';
import { MinioService } from './minio/minio.service';
import {
  InitiateUploadInputDto,
  CompleteUploadInputDto,
  GetDownloadLinkInputDto,
} from './dto/file.input.dto';
import {
  InitiateUploadOutputDto,
  CompleteUploadOutputDto,
  GetDownloadLinkOutputDto,
  DeleteFileOutputDto,
} from './dto/file.output.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly filesRepo: FilesRepository,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  private generateUniqueFilename(original: string): string {
    const ext = original.includes('.') ? original.slice(original.lastIndexOf('.')) : '';
    return `${Date.now()}${ext}`;
  }

  async initiateUpload(input: InitiateUploadInputDto, userId: string): Promise<InitiateUploadOutputDto> {
    if (!userId) {
      throw new BadRequestException('user_id is required');
    }

    const uniqueFilename = this.generateUniqueFilename(input.filename);
    const storagePath = `${userId}/${new Date().toISOString().split('T')[0].replace(/-/g, '/')}/${uniqueFilename}`;

    const file = await this.filesRepo.create({
      id: uuidv4(),
      userId,
      filename: uniqueFilename,
      originalName: input.filename,
      path: input.path || '/',
      size: input.size || 0,
      mimeType: input.mimeType || 'application/octet-stream',
      storagePath,
      bucket: this.configService.get<string>('MINIO_BUCKET', 'cloud-storage'),
      isPublic: input.isPublic || false,
      tags: input.tags || null,
      isTrashed: false,
      trashedAt: null,
    });

    const presignedURL = await this.minioService.presignedPutObject(
      this.configService.get<string>('MINIO_BUCKET', 'cloud-storage'),
      storagePath,
      900,
    );

    this.logger.log(`Upload initiated for file ${file.id}`);

    return {
      fileId: file.id,
      uploadURL: presignedURL,
      uploadMethod: 'PUT',
      headers: {},
      expiresIn: 900,
    };
  }

  async completeUpload(input: CompleteUploadInputDto, userId: string): Promise<CompleteUploadOutputDto> {
    const file = await this.filesRepo.findByIdAndUserOrFail(input.fileId, userId);

    try {
      await this.minioService.statObject(file.bucket, file.storagePath);
    } catch {
      throw new NotFoundException('File not found in storage');
    }

    this.logger.log(`Upload completed for file ${file.id}`);

    return {
      storagePath: file.storagePath,
      createdAt: file.createdAt,
    };
  }

  async getDownloadLink(
    fileId: string,
    query: GetDownloadLinkInputDto,
    userId: string,
  ): Promise<GetDownloadLinkOutputDto> {
    const access = await this.filesRepo.checkAccess(fileId, userId);

    if (!access.hasAccess) {
      throw new ForbiddenException('Access denied');
    }

    const expires = query.expiresIn ? query.expiresIn : 3600;
    const presignedURL = await this.minioService.presignedGetObject(
      access.bucket!,
      access.storagePath!,
      expires,
    );

    this.logger.log(`Download link generated for file ${fileId}`);

    return {
      downloadURL: presignedURL,
      method: 'GET',
      headers: {},
      expiresIn: expires,
    };
  }

  async deleteFile(fileId: string, userId: string): Promise<DeleteFileOutputDto> {
    const file = await this.filesRepo.findByIdAndUserOrFail(fileId, userId);

    try {
      await this.minioService.removeObject(file.bucket, file.storagePath);
    } catch (error) {
      this.logger.warn(`Failed to remove from storage: ${error.message}`);
    }

    await this.filesRepo.delete(fileId, userId);

    this.logger.log(`File ${fileId} deleted`);

    return { success: true };
  }
}