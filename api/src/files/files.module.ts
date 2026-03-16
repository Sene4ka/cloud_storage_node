import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { FilesRepository } from './files.repository';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    CommonModule,
  ],
  providers: [FilesRepository],
  exports: [FilesRepository],
})
export class FilesModule {}