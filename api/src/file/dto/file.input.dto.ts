import {
  IsString, IsOptional, IsBoolean,
  IsInt, Min, IsObject, IsUUID, IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InputType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class InitiateUploadInputDto {
  @ApiProperty({ description: 'Original filename' })
  @IsString()
  @IsNotEmpty()
  @Field()
  filename: string;

  @ApiProperty({ description: 'File path/folder', required: false })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  path?: string;

  @ApiProperty({ description: 'MIME type', required: false })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  mimeType?: string;

  @ApiProperty({ description: 'File size in bytes', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  size?: number;

  @ApiProperty({ description: 'Is file public', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true, defaultValue: false })
  isPublic?: boolean;

  @ApiProperty({ description: 'File tags', required: false })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { nullable: true })
  tags?: Record<string, string>;
}

@InputType()
export class CompleteUploadInputDto {
  @ApiProperty()
  @IsUUID()
  @Field()
  fileId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  eTag?: string;
}

@InputType()
export class GetDownloadLinkInputDto {
  @ApiProperty({ description: 'Link expiration in seconds', default: 3600, required: false })
  @IsInt()
  @Min(60)
  @IsOptional()
  @Field(() => Int, { nullable: true, defaultValue: 3600 })
  expiresIn?: number;
}