import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../common/guards/jwt-auth.guard';
import {FileService} from './file.service';
import {CompleteUploadInputDto, GetDownloadLinkInputDto, InitiateUploadInputDto,} from './dto/file.input.dto';
import {
  CompleteUploadOutputDto as CompleteUploadOutput,
  DeleteFileOutputDto as DeleteFileOutput,
  GetDownloadLinkOutputDto as GetDownloadLinkOutput,
  InitiateUploadOutputDto as InitiateUploadOutput,
} from './dto/file.output.dto';

@ApiTags('files')
@UseGuards(JwtAuthGuard)
@Controller('api/v2/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Initiate file upload' })
  @ApiResponse({ status: 201, type: InitiateUploadOutput })
  @Header('Location', '')
  async initiateUpload(@Body() input: InitiateUploadInputDto, @Request() req) {
    return await this.fileService.initiateUpload(input, req.user.userId);
  }

  @Post('upload/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete file upload' })
  @ApiResponse({ status: 200, type: CompleteUploadOutput })
  async completeUpload(@Body() input: CompleteUploadInputDto, @Request() req) {
    return this.fileService.completeUpload(input, req.user.userId);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download link' })
  @ApiResponse({ status: 200, type: GetDownloadLinkOutput })
  async getDownloadLink(
    @Param('id') id: string,
    @Query() query: GetDownloadLinkInputDto,
    @Request() req,
  ) {
    return this.fileService.getDownloadLink(id, query, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, type: DeleteFileOutput })
  async deleteFile(@Param('id') id: string, @Request() req) {
    return this.fileService.deleteFile(id, req.user.userId);
  }
}