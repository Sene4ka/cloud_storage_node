import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MetadataService } from './metadata.service';
import { ListMetadataInputDto, UpdateMetadataInputDto } from './dto/metadata.input.dto';
import {
    ListMetadataType,
    GetMetadataType,
    UpdateMetadataType,
    TrashFileType,
    RestoreFileType,
    DeleteMetadataType,
} from './models/metadata.model';

@Resolver()
@UseGuards(JwtAuthGuard)
export class MetadataResolver {
    constructor(private readonly metadataService: MetadataService) {}

    @Query(() => ListMetadataType)
    async listMetadata(
        @Args('input', { nullable: true }) input: ListMetadataInputDto,
        @Context() ctx,
    ) {
        return this.metadataService.listMetadata(ctx.req.user.userId, input);
    }

    @Query(() => GetMetadataType)
    async getMetadata(
        @Args('id') id: string,
        @Context() ctx,
    ) {
        return this.metadataService.getMetadata(id, ctx.req.user.userId);
    }

    @Mutation(() => UpdateMetadataType)
    async updateMetadata(
        @Args('id') id: string,
        @Args('input') input: UpdateMetadataInputDto,
        @Context() ctx,
    ) {
        return this.metadataService.updateMetadata(id, input, ctx.req.user.userId);
    }

    @Mutation(() => DeleteMetadataType)
    async deleteMetadata(
        @Args('id') id: string,
        @Context() ctx,
    ) {
        await this.metadataService.deleteMetadata(id, ctx.req.user.userId);
        return { success: true };
    }

    @Mutation(() => TrashFileType)
    async trashFile(
        @Args('id') id: string,
        @Context() ctx,
    ) {
        return this.metadataService.trashFile(id, ctx.req.user.userId);
    }

    @Mutation(() => RestoreFileType)
    async restoreFile(
        @Args('id') id: string,
        @Context() ctx,
    ) {
        return this.metadataService.restoreFile(id, ctx.req.user.userId);
    }
}