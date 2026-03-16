import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { File } from './entities/file.entity';

export interface ListFilesOptions {
  userId: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  isTrashed?: boolean;
}

export interface ListFilesResult {
  files: File[];
  total: number;
}

@Injectable()
export class FilesRepository {
  constructor(
    @InjectRepository(File)
    private readonly repo: Repository<File>,
  ) {}

  async create(fileData: Partial<File>): Promise<File> {
    const entity = this.repo.create(fileData);
    return this.repo.save(entity);
  }

  async findById(id: string): Promise<File | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByIdOrFail(id: string): Promise<File> {
    const file = await this.repo.findOne({ where: { id } });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async findByIdAndUser(id: string, userId: string): Promise<File | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  async findByIdAndUserOrFail(id: string, userId: string): Promise<File> {
    const file = await this.repo.findOne({ where: { id, userId } });

    if (!file) {
      throw new NotFoundException('File not found or access denied');
    }

    return file;
  }

  async listByUser(options: ListFilesOptions): Promise<ListFilesResult> {
    const {
      userId,
      page,
      pageSize,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      isTrashed,
    } = options;

    const offset = (page - 1) * pageSize;

    const queryBuilder = this.repo
      .createQueryBuilder('file')
      .where('file.userId = :userId', { userId });

    if (isTrashed !== undefined) {
      queryBuilder.andWhere('file.isTrashed = :isTrashed', { isTrashed });
    }

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('file.filename ILIKE :search', { search: `%${search}%` })
            .orWhere('file.originalName ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const validSortFields = ['createdAt', 'updatedAt', 'filename', 'size', 'path'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    queryBuilder.orderBy(`file.${orderField}`, sortOrder);

    const [files, total] = await queryBuilder
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();

    return { files, total };
  }

  async update(id: string, userId: string, updates: Partial<File>): Promise<File> {
    const result = await this.repo.update({ id, userId }, { ...updates, updatedAt: new Date() });

    if (result.affected === 0) {
      throw new NotFoundException('File not found or access denied');
    }

    const file = await this.findById(id);

    if (!file) {
      throw new NotFoundException('File not found after update');
    }

    return file;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.repo.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException('File not found or access denied');
    }
  }

  async checkAccess(fileId: string, userId: string): Promise<{
    hasAccess: boolean;
    storagePath?: string;
    bucket?: string;
  }> {
    const file = await this.repo.findOne({
      where: { id: fileId },
      select: ['storagePath', 'bucket', 'isPublic', 'userId'],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.isPublic || file.userId === userId) {
      return {
        hasAccess: true,
        storagePath: file.storagePath,
        bucket: file.bucket,
      };
    }

    return { hasAccess: false };
  }

  async setTrashed(id: string, userId: string, isTrashed: boolean): Promise<void> {
    const result = await this.repo.update(
      { id, userId },
      {
        isTrashed,
        trashedAt: isTrashed ? new Date() : null,
        updatedAt: new Date(),
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('File not found or access denied');
    }
  }

  async findByUserId(userId: string, isTrashed: boolean = false): Promise<File[]> {
    return this.repo.find({
      where: { userId, isTrashed },
      order: { createdAt: 'DESC' },
    });
  }
}