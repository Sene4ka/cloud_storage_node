import { ObjectType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class FileMetadataType {
    @Field()
    id: string;

    @Field()
    userId: string;

    @Field()
    filename: string;

    @Field()
    originalName: string;

    @Field()
    path: string;

    @Field(() => Int)
    size: number;

    @Field()
    mimeType: string;

    @Field()
    storagePath: string;

    @Field()
    bucket: string;

    @Field()
    isPublic: boolean;

    @Field(() => GraphQLJSON, { nullable: true })
    tags?: Record<string, string>;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field()
    isTrashed: boolean;

    @Field({ nullable: true })
    trashedAt?: Date;
}

@ObjectType()
export class ListMetadataType {
    @Field(() => [FileMetadataType])
    items: FileMetadataType[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    pageSize: number;

    @Field(() => Int)
    totalPages: number;
}

@ObjectType()
export class GetMetadataType {
    @Field(() => FileMetadataType)
    file: FileMetadataType;
}

@ObjectType()
export class UpdateMetadataType {
    @Field(() => FileMetadataType)
    file: FileMetadataType;
}

@ObjectType()
export class TrashFileType {
    @Field()
    success: boolean;

    @Field()
    message: string;
}

@ObjectType()
export class RestoreFileType {
    @Field()
    success: boolean;

    @Field()
    message: string;
}

@ObjectType()
export class DeleteMetadataType {
    @Field()
    success: boolean;
}