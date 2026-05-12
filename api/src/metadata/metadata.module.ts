import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../files/entities/file.entity';
import { FilesRepository } from '../files/files.repository';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import { CommonModule } from '../common/common.module';
import { FilesModule } from '../files/files.module';
import {MetadataResolver} from "./metadata.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    CommonModule,
    FilesModule,
  ],
  providers: [MetadataService, MetadataResolver, FilesRepository],
  controllers: [MetadataController],
  exports: [MetadataService],
})
export class MetadataModule {}