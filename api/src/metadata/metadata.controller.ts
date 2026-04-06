import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MetadataService } from './metadata.service';
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
} from './dto/metadata.output.dto';

@ApiTags('metadata')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/files')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get()
  @ApiOperation({ summary: 'List user files metadata' })
  @ApiResponse({ status: 200, type: ListMetadataOutputDto })
  async listMetadata(
    @Request() req,
    @Query() query: ListMetadataInputDto,
  ) {
    return this.metadataService.listMetadata(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file metadata' })
  @ApiResponse({ status: 200, type: GetMetadataOutputDto })
  async getMetadata(@Param('id') id: string, @Request() req) {
    return this.metadataService.getMetadata(id, req.user.userId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update file metadata' })
  @ApiResponse({ status: 200, type: UpdateMetadataOutputDto })
  async updateMetadata(
    @Param('id') id: string,
    @Body() input: UpdateMetadataInputDto,
    @Request() req,
  ) {
    return this.metadataService.updateMetadata(id, input, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete file metadata' })
  async deleteMetadata(@Param('id') id: string, @Request() req) {
    await this.metadataService.deleteMetadata(id, req.user.userId);
    return { success: true };
  }

  @Post(':id/trash')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Move file to trash' })
  @ApiResponse({ status: 200, type: TrashFileOutputDto })
  async trashFile(@Param('id') id: string, @Request() req) {
    return this.metadataService.trashFile(id, req.user.userId);
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restore file from trash' })
  @ApiResponse({ status: 200, type: RestoreFileOutputDto })
  async restoreFile(@Param('id') id: string, @Request() req) {
    return this.metadataService.restoreFile(id, req.user.userId);
  }
}