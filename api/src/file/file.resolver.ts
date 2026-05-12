import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { FileService } from './file.service';
import { InitiateUploadInputDto, CompleteUploadInputDto, GetDownloadLinkInputDto } from './dto/file.input.dto';
import { InitiateUploadType, CompleteUploadType, GetDownloadLinkType, DeleteFileType } from './models/file.model';

@Resolver()
@UseGuards(JwtAuthGuard)
export class FileResolver {
    constructor(private readonly fileService: FileService) {}

    @Mutation(() => InitiateUploadType)
    async initiateUpload(
        @Args('input') input: InitiateUploadInputDto,
        @Context() ctx,
    ) {
        return this.fileService.initiateUpload(input, ctx.req.user.userId);
    }

    @Mutation(() => CompleteUploadType)
    async completeUpload(
        @Args('input') input: CompleteUploadInputDto,
        @Context() ctx,
    ) {
        return this.fileService.completeUpload(input, ctx.req.user.userId);
    }

    @Query(() => GetDownloadLinkType)
    async getDownloadLink(
        @Args('id') id: string,
        @Args('input') input: GetDownloadLinkInputDto,
        @Context() ctx,
    ) {
        return this.fileService.getDownloadLink(id, input, ctx.req.user.userId);
    }

    @Mutation(() => DeleteFileType)
    async deleteFile(
        @Args('id') id: string,
        @Context() ctx,
    ) {
        return this.fileService.deleteFile(id, ctx.req.user.userId);
    }
}