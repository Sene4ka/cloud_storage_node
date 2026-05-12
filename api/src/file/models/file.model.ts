import { ObjectType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class InitiateUploadType {
    @Field()
    fileId: string;

    @Field()
    uploadURL: string;

    @Field()
    uploadMethod: string;

    @Field(() => GraphQLJSON)
    headers: Record<string, string>;

    @Field(() => Int)
    expiresIn: number;
}

@ObjectType()
export class CompleteUploadType {
    @Field()
    storagePath: string;

    @Field()
    createdAt: Date;
}

@ObjectType()
export class GetDownloadLinkType {
    @Field()
    downloadURL: string;

    @Field()
    method: string;

    @Field(() => GraphQLJSON)
    headers: Record<string, string>;

    @Field(() => Int)
    expiresIn: number;
}

@ObjectType()
export class DeleteFileType {
    @Field()
    success: boolean;
}