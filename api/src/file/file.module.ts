import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../files/entities/file.entity';
import { FilesRepository } from '../files/files.repository';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MinioService } from './minio/minio.service';
import { CommonModule } from '../common/common.module';
import { FilesModule } from '../files/files.module';
import {FileResolver} from "./file.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    CommonModule,
    FilesModule,
  ],
  providers: [FileService, FileResolver, MinioService, FilesRepository],
  controllers: [FileController],
  exports: [FileService, MinioService],
})
export class FileModule {}